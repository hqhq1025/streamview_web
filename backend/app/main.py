import os
import platform
import uuid
from contextlib import asynccontextmanager
from typing import Any, Dict, Optional

from fastapi import Depends, FastAPI, File, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from mcp.server.fastmcp import FastMCP

from .config import Settings, get_settings
from .file_schemas import FileListResponse, FileUploadResponse, FileMetadata
from .file_store import (
    delete_user_files,
    format_file_size,
    guess_mime_type,
    list_user_files,
    resolve_user_file,
    save_upload,
    split_file_id,
    split_stored_name,
)
from .schemas import (
    CommentRequest,
    InfoResponse,
    ModeratorRequest,
    PlaylistCreateRequest,
    ReportCommentRequest,
    StatePatchRequest,
    StateRequest,
    StateResponse,
    UserManagementRequest,
    VideoActionRequest,
)
from .state_store import StateStore
from .youtube_service import (
    add_comment,
    add_moderator,
    add_watch_history,
    clear_history,
    create_playlist,
    hide_user,
    mark_all_notifications_read,
    mark_notification_read,
    remove_from_history,
    remove_comment,
    remove_moderator,
    report_comment,
    toggle_comment_heart,
    toggle_comment_reaction,
    toggle_dislike,
    toggle_like,
    toggle_playlist_video,
    toggle_subscription,
    toggle_watch_later,
    unhide_user,
)

settings = get_settings()
store = StateStore()

tags_metadata = [
    {"name": "state", "description": "Manage per-user experiment state"},
    {"name": "system", "description": "Environment and health information"},
    {"name": "files", "description": "User-scoped file uploads"},
    {"name": "streamview", "description": "StreamView mock actions for per-user state"},
]


def build_file_url(filename: str) -> str:
    return f"{settings.api_prefix}/files/{filename}"


def build_file_metadata(
    *,
    file_id: str,
    filename: str,
    name: str,
    size_bytes: int,
    content_type: str,
) -> FileMetadata:
    return FileMetadata(
        id=file_id,
        name=name,
        size=format_file_size(size_bytes),
        type=content_type,
        url=build_file_url(filename),
        filename=filename,
    )


def _resolve_user_cookie(provided: Optional[str]) -> str:
    return provided if provided else str(uuid.uuid4())


# MCP server mirrors REST API operations via Streamable HTTP
mcp_server = FastMCP(
    name=f"{settings.app_name} MCP",
    instructions=(
        "Streamable HTTP MCP interface mirroring the REST API. "
        "Supply user_cookie to reuse the same per-user state; "
        "omit to generate a new cookie-backed state."
    ),
    host="0.0.0.0",
    streamable_http_path="/",
)

mcp_http_app = mcp_server.streamable_http_app()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start MCP session manager so Streamable HTTP transport works when mounted
    mcp_ctx = mcp_server.session_manager.run()
    await mcp_ctx.__aenter__()
    try:
        yield
    finally:
        await mcp_ctx.__aexit__(None, None, None)


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    openapi_tags=tags_metadata,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_user_id(
    request: Request, response: Response, settings: Settings = Depends(get_settings)
) -> str:
    cookie_override = request.query_params.get("cookie")
    user_id = cookie_override or request.cookies.get(settings.cookie_name)
    if not user_id:
        user_id = str(uuid.uuid4())
    response.set_cookie(
        settings.cookie_name,
        user_id,
        max_age=settings.cookie_max_age,
        httponly=False,
        samesite="lax",
    )
    return user_id


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    # Minimal middleware that ensures each response carries a request id header.
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    response: JSONResponse = await call_next(request)
    response.headers["x-request-id"] = request_id
    return response


@app.get("/health", tags=["system"])
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/state-doc", tags=["system"])
async def state_doc():
    from pathlib import Path
    content = Path("/app/STATE.md").read_text(encoding="utf-8")
    return Response(content=content, media_type="text/plain; charset=utf-8")


# when build on the basesite, the below endpoints about state management should remain unchanged
@app.get(f"{settings.api_prefix}/state", response_model=StateResponse, tags=["state"])
async def get_state(user_id: str = Depends(get_user_id)) -> StateResponse:
    state = await store.get_state(user_id)
    return StateResponse(user_id=user_id, state=state)


@app.put(
    f"{settings.api_prefix}/state",
    response_model=StateResponse,
    tags=["state"],
    summary="Replace state",
)
async def put_state(payload: StateRequest, user_id: str = Depends(get_user_id)) -> StateResponse:
    next_state = {"data": payload.data, "note": payload.note}
    if payload.meta is not None:
        next_state["meta"] = payload.meta
    state = await store.replace_state(user_id, next_state)
    return StateResponse(user_id=user_id, state=state)


@app.patch(
    f"{settings.api_prefix}/state",
    response_model=StateResponse,
    tags=["state"],
    summary="Merge into existing state",
)
async def patch_state(
    payload: StatePatchRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.patch_state(user_id, patch=payload.data, note=payload.note)
    return StateResponse(user_id=user_id, state=state)


@app.delete(
    f"{settings.api_prefix}/state",
    response_model=StateResponse,
    tags=["state"],
    summary="Reset and clear state",
)
async def delete_state(user_id: str = Depends(get_user_id)) -> StateResponse:
    delete_user_files(user_id)
    state = await store.reset_state(user_id)
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/files",
    response_model=FileUploadResponse,
    tags=["files"],
    summary="Upload files for the current user",
)
async def upload_files(
    files: list[UploadFile] = File(...),
    user_id: str = Depends(get_user_id),
) -> FileUploadResponse:
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    uploaded: list[FileMetadata] = []
    for upload in files:
        saved = save_upload(user_id, upload)
        uploaded.append(
            build_file_metadata(
                file_id=saved["id"],
                filename=saved["filename"],
                name=saved["name"],
                size_bytes=saved["size_bytes"],
                content_type=saved["type"],
            )
        )
        await upload.close()

    return FileUploadResponse(user_id=user_id, files=uploaded)


@app.get(
    f"{settings.api_prefix}/files",
    response_model=FileListResponse,
    tags=["files"],
    summary="List files for the current user",
)
async def list_files(user_id: str = Depends(get_user_id)) -> FileListResponse:
    file_entries: list[FileMetadata] = []
    paths = sorted(list_user_files(user_id), key=lambda path: path.stat().st_mtime, reverse=True)
    for path in paths:
        filename = path.name
        file_entries.append(
            build_file_metadata(
                file_id=split_file_id(filename),
                filename=filename,
                name=split_stored_name(filename),
                size_bytes=path.stat().st_size,
                content_type=guess_mime_type(path),
            )
        )
    return FileListResponse(user_id=user_id, files=file_entries)


@app.get(
    f"{settings.api_prefix}/files/{{filename}}",
    response_class=FileResponse,
    tags=["files"],
    summary="Fetch a file by name for the current user",
)
async def get_file(filename: str, user_id: str = Depends(get_user_id)) -> FileResponse:
    path = resolve_user_file(user_id, filename)
    if not path:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path,
        media_type=guess_mime_type(path),
        filename=split_stored_name(filename),
        content_disposition_type="inline",
    )


@app.post(
    f"{settings.api_prefix}/streamview/videos/{{video_id}}/like",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle like on a video",
)
async def youtube_toggle_like(video_id: str, user_id: str = Depends(get_user_id)) -> StateResponse:
    try:
        state = await store.mutate_data(user_id, lambda data: toggle_like(data, video_id))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/videos/{{video_id}}/dislike",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle dislike on a video",
)
async def youtube_toggle_dislike(
    video_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(user_id, lambda data: toggle_dislike(data, video_id))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/videos/{{video_id}}/watch-later",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle watch-later for a video",
)
async def youtube_toggle_watch_later(
    video_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: toggle_watch_later(data, video_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/channels/{{channel_id}}/subscribe",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle subscription for a channel",
)
async def youtube_toggle_subscription(
    channel_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: toggle_subscription(data, channel_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/history",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Add a video to watch history",
)
async def youtube_add_history(
    payload: VideoActionRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: add_watch_history(data, payload.video_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.delete(
    f"{settings.api_prefix}/streamview/history/{{video_id}}",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Remove a video from watch history",
)
async def youtube_remove_history(
    video_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id, lambda data: remove_from_history(data, video_id)
    )
    return StateResponse(user_id=user_id, state=state)


@app.delete(
    f"{settings.api_prefix}/streamview/history",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Clear watch history",
)
async def youtube_clear_history(user_id: str = Depends(get_user_id)) -> StateResponse:
    state = await store.mutate_data(user_id, lambda data: clear_history(data))
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/comments",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Add a comment or reply",
)
async def youtube_add_comment(
    payload: CommentRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id,
            lambda data: add_comment(
                data, payload.video_id, payload.text, payload.parent_comment_id
            ),
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/comments/{{comment_id}}/like",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle like on a comment",
)
async def youtube_toggle_comment_like(
    comment_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: toggle_comment_reaction(data, comment_id, "like")
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/comments/{{comment_id}}/dislike",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle dislike on a comment",
)
async def youtube_toggle_comment_dislike(
    comment_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: toggle_comment_reaction(data, comment_id, "dislike")
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/comments/{{comment_id}}/heart",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle heart on a comment",
)
async def youtube_toggle_comment_heart(
    comment_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: toggle_comment_heart(data, comment_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.delete(
    f"{settings.api_prefix}/streamview/comments/{{comment_id}}",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Remove a comment or reply",
)
async def youtube_remove_comment(
    comment_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: remove_comment(data, comment_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/playlists",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Create a playlist",
)
async def youtube_create_playlist(
    payload: PlaylistCreateRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id,
        lambda data: create_playlist(data, payload.name, payload.description, payload.privacy),
    )
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/playlists/{{playlist_id}}/videos/{{video_id}}",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Toggle a video inside a playlist",
)
async def youtube_toggle_playlist_video(
    playlist_id: str, video_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: toggle_playlist_video(data, playlist_id, video_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/notifications/{{notification_id}}/read",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Mark a notification as read",
)
async def youtube_mark_notification_read(
    notification_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    try:
        state = await store.mutate_data(
            user_id, lambda data: mark_notification_read(data, notification_id)
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/notifications/read-all",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Mark all notifications as read",
)
async def youtube_mark_all_notifications_read(
    user_id: str = Depends(get_user_id),
) -> StateResponse:
    state = await store.mutate_data(
        user_id, lambda data: mark_all_notifications_read(data)
    )
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/users/hide",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Hide a user and remove all their comments",
)
async def youtube_hide_user(
    payload: UserManagementRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id,
        lambda data: hide_user(data, payload.user_id, payload.user_name, payload.user_avatar),
    )
    return StateResponse(user_id=user_id, state=state)


@app.delete(
    f"{settings.api_prefix}/streamview/users/{{target_user_id}}/hide",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Unhide a user",
)
async def youtube_unhide_user(
    target_user_id: str, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id, lambda data: unhide_user(data, target_user_id)
    )
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/users/moderator",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Add a user as a moderator",
)
async def youtube_add_moderator(
    payload: ModeratorRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id,
        lambda data: add_moderator(
            data, payload.user_id, payload.user_name, payload.user_avatar, payload.moderator_type
        ),
    )
    return StateResponse(user_id=user_id, state=state)


@app.delete(
    f"{settings.api_prefix}/streamview/users/{{target_user_id}}/moderator",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Remove a user from moderators",
)
async def youtube_remove_moderator(
    target_user_id: str, moderator_type: str = "standard", user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id, lambda data: remove_moderator(data, target_user_id, moderator_type)
    )
    return StateResponse(user_id=user_id, state=state)


@app.post(
    f"{settings.api_prefix}/streamview/comments/{{comment_id}}/report",
    response_model=StateResponse,
    tags=["streamview"],
    summary="Report a comment",
)
async def youtube_report_comment(
    comment_id: str, payload: ReportCommentRequest, user_id: str = Depends(get_user_id)
) -> StateResponse:
    state = await store.mutate_data(
        user_id,
        lambda data: report_comment(data, comment_id, payload.reason, payload.details),
    )
    return StateResponse(user_id=user_id, state=state)


@app.get(
    f"{settings.api_prefix}/info",
    response_model=InfoResponse,
    tags=["system"],
    summary="System and request info",
)
async def info(request: Request, user_id: str = Depends(get_user_id)) -> InfoResponse:
    runtime_env = {
        "python_version": platform.python_version(),
        "platform": platform.platform(),
        "env_mode": os.getenv("ENV", "dev"),
    }
    request_info: Dict[str, Any] = {
        "client": request.client.host if request.client else "unknown",
        "headers": dict(request.headers),
        "path": request.url.path,
        "method": request.method,
        "user_id": user_id,
    }
    return InfoResponse(
        app_name=settings.app_name,
        python_version=runtime_env["python_version"],
        env=runtime_env,
        request=request_info,
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "request_id": request.headers.get("x-request-id")},
    )

# these are for demo only, in later stages user should not have direct access to these functions
@mcp_server.tool(
    name="get_state",
    description="Fetch state for a user. Provide user_cookie to reuse identity; otherwise a new one is created.",
)
async def mcp_get_state(user_cookie: Optional[str] = None) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.get_state(user_id)
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="replace_state",
    description="Replace state for a user with provided data and optional note.",
)
async def mcp_replace_state(
    data: Dict[str, Any],
    note: Optional[str] = None,
    user_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.replace_state(user_id, {"data": data, "note": note})
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="patch_state",
    description="Deep-merge data into existing state for a user; include user_cookie to target an existing session.",
)
async def mcp_patch_state(
    data: Dict[str, Any],
    note: Optional[str] = None,
    user_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.patch_state(user_id, patch=data, note=note)
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="reset_state",
    description="Reset the user's state to a new blank object.",
)
async def mcp_reset_state(user_cookie: Optional[str] = None) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.reset_state(user_id)
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="info",
    description="Return backend environment info and the resolved user id.",
)
async def mcp_info(user_cookie: Optional[str] = None) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    runtime_env = {
        "python_version": platform.python_version(),
        "platform": platform.platform(),
        "env_mode": os.getenv("ENV", "dev"),
    }
    return {
        "app_name": settings.app_name,
        "user_id": user_id,
        "env": runtime_env,
    }


@mcp_server.tool(
    name="toggle_like",
    description="Toggle a like on a video for the current user.",
)
async def mcp_toggle_like(video_id: str, user_cookie: Optional[str] = None) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(user_id, lambda data: toggle_like(data, video_id))
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="toggle_watch_later",
    description="Toggle watch later for a video for the current user.",
)
async def mcp_toggle_watch_later(video_id: str, user_cookie: Optional[str] = None) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(user_id, lambda data: toggle_watch_later(data, video_id))
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="toggle_subscription",
    description="Toggle subscription to a channel for the current user.",
)
async def mcp_toggle_subscription(
    channel_id: str, user_cookie: Optional[str] = None
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(
        user_id, lambda data: toggle_subscription(data, channel_id)
    )
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="add_watch_history",
    description="Add a video to watch history and increment its view count.",
)
async def mcp_add_watch_history(
    video_id: str, user_cookie: Optional[str] = None
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(user_id, lambda data: add_watch_history(data, video_id))
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="remove_from_history",
    description="Remove a video from watch history.",
)
async def mcp_remove_from_history(
    video_id: str, user_cookie: Optional[str] = None
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(user_id, lambda data: remove_from_history(data, video_id))
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="clear_history",
    description="Clear the watch history list for the current user.",
)
async def mcp_clear_history(user_cookie: Optional[str] = None) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(user_id, lambda data: clear_history(data))
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="add_comment",
    description="Add a comment or reply to a video.",
)
async def mcp_add_comment(
    video_id: str,
    text: str,
    parent_comment_id: Optional[str] = None,
    user_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(
        user_id, lambda data: add_comment(data, video_id, text, parent_comment_id)
    )
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="create_playlist",
    description="Create a new playlist for the current user.",
)
async def mcp_create_playlist(
    name: str,
    description: str = "",
    privacy: str = "Public",
    user_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(
        user_id, lambda data: create_playlist(data, name, description, privacy)
    )
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="toggle_playlist_video",
    description="Add or remove a video from a playlist.",
)
async def mcp_toggle_playlist_video(
    playlist_id: str,
    video_id: str,
    user_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(
        user_id, lambda data: toggle_playlist_video(data, playlist_id, video_id)
    )
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="mark_notification_read",
    description="Mark a single notification as read.",
)
async def mcp_mark_notification_read(
    notification_id: str, user_cookie: Optional[str] = None
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(
        user_id, lambda data: mark_notification_read(data, notification_id)
    )
    return {"user_id": user_id, "state": state.model_dump()}


@mcp_server.tool(
    name="mark_all_notifications_read",
    description="Mark all notifications as read.",
)
async def mcp_mark_all_notifications_read(
    user_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = _resolve_user_cookie(user_cookie)
    state = await store.mutate_data(
        user_id, lambda data: mark_all_notifications_read(data)
    )
    return {"user_id": user_id, "state": state.model_dump()}


# Mount MCP Streamable HTTP app at /mcp for remote access
app.mount("/mcp", mcp_http_app)
