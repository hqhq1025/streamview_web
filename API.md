# API Reference

Base path: `/api`

All endpoints assume cookie-based user identification. A new `user_id` cookie is issued on
first request. Include credentials on cross-site calls.

## Health
- `GET /health` — simple liveness probe. Response: `{"status":"ok"}`.

## State
- `GET /state` — fetch current state for this cookie.
  - Response `200`: `{ "user_id": "uuid", "state": { "meta": {...}, "data": {...}, "note": "..." } }`
- `PUT /state` — replace the entire state payload.
  - Body: `{ "data": { ... }, "note": "optional string", "meta": { ... } }`
  - Response: same shape as GET.
- `PATCH /state` — deep-merge into the existing `data` field.
  - Body: `{ "data": { ... }, "note": "optional string" }`
  - Response: merged state.
- `DELETE /state` — reset state to a new blank object and fresh metadata.
  - Response: `{ "user_id": "...", "state": { "meta": {...}, "data": {}, "note": null } }`

Notes:
- `meta.version` increments on patch/merge operations; resets on replace/reset.
- Default state includes example file metadata under `data.examples.huggingface_file`.
- Default state also seeds StreamView mock data under `data.user`, `data.videos`, `data.channels`,
  `data.comments`, `data.playlists`, `data.notifications`, and `data.categories`.
- Studio uploads are stored in `data.videos` with `origin: "studio"` and file metadata under
  `data.videos[].asset`.

## StreamView actions
These endpoints mutate the per-user StreamView mock state and return the same response shape as `GET /state`.

- `POST /streamview/videos/{video_id}/like` — toggle like on a video.
- `POST /streamview/videos/{video_id}/watch-later` — toggle watch later for a video.
- `POST /streamview/channels/{channel_id}/subscribe` — toggle channel subscription.
- `POST /streamview/history` — add to watch history.
  - Body: `{ "video_id": "video-1" }`
- `DELETE /streamview/history/{video_id}` — remove a video from watch history.
- `DELETE /streamview/history` — clear watch history.
- `POST /streamview/comments` — add a comment or reply.
  - Body: `{ "video_id": "video-1", "text": "Nice!", "parent_comment_id": "comment-..." }`
- `POST /streamview/playlists` — create a new playlist.
  - Body: `{ "name": "My list", "description": "optional", "privacy": "Public" }`
- `POST /streamview/playlists/{playlist_id}/videos/{video_id}` — add/remove a video in a playlist.
- `POST /streamview/notifications/{notification_id}/read` — mark a notification as read.
- `POST /streamview/notifications/read-all` — mark all notifications as read.

## Files
- `POST /files` — upload one or more files (multipart/form-data).
  - Form field: `files` (repeatable).
  - Response `200`:
    ```json
    {
      "user_id": "uuid",
      "files": [
        {
          "id": "abc123",
          "name": "video.mov",
          "size": "245 KB",
          "type": "video/quicktime",
          "url": "/api/files/abc123__video.mov",
          "filename": "abc123__video.mov"
        }
      ]
    }
    ```
- `GET /files` — list files for the current user.
- `GET /files/{filename}` — fetch a stored file (scoped to the cookie).

## Info
- `GET /info` — return runtime and request context for debugging.

## MCP (Streamable HTTP)
- Endpoint: `/mcp` (streamable HTTP transport).
- Tools: `get_state`, `replace_state`, `patch_state`, `reset_state`, `info`, plus StreamView actions.
- Include `user_cookie` to target a specific user state; omit to create a new cookie-scoped state.

## Error shape
- HTTP errors return `{ "detail": "message", "request_id": "<uuid>" }`.
- Non-2xx responses keep the `user_id` cookie intact.
