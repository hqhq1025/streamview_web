"""Video record lifecycle helpers for the streamview upload/publish flow."""

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .models import StateMeta

VALID_VISIBILITIES = ("public", "unlisted", "private")


class VideoNotFoundError(LookupError):
    """Raised by publish_video when the requested id is missing."""


class InvalidVisibilityError(ValueError):
    """Raised when ``visibility`` is not one of the allowed values."""


def normalize_visibility(value: Any, *, default: str = "public") -> str:
    """Lowercase and validate a visibility value. Falls back to ``default`` for
    missing/empty input; rejects anything else."""
    if value is None or value == "":
        return default
    if not isinstance(value, str):
        raise InvalidVisibilityError(value)
    lowered = value.strip().lower()
    if lowered not in VALID_VISIBILITIES:
        raise InvalidVisibilityError(value)
    return lowered


def _find_video(data: Dict[str, Any], video_id: str) -> Optional[Dict[str, Any]]:
    for video in data.get("videos", []):
        if isinstance(video, dict) and video.get("id") == video_id:
            return video
    return None


def create_video(
    data: Dict[str, Any],
    *,
    file_meta: Dict[str, Any],
    title: str,
    description: str,
    tags: List[str],
    user_id: str,
    meta: StateMeta,
    visibility: str = "public",
) -> Dict[str, Any]:
    """Append a freshly uploaded video to ``data.videos`` (idempotent on title)."""
    _ = user_id, meta  # accepted for route symmetry, not used here
    visibility_normalized = normalize_visibility(visibility)

    videos = data.setdefault("videos", [])
    videos[:] = [v for v in videos if not (isinstance(v, dict) and v.get("title") == title)]

    video_id = f"vid_{uuid.uuid4().hex[:12]}"
    video: Dict[str, Any] = {
        "id": video_id,
        "title": title,
        "description": description,
        "tags": list(tags),
        "status": "draft",
        "visibility": visibility_normalized,
        "asset": {
            "url": f"/api/files/{file_meta['filename']}",
            "filename": file_meta["filename"],
            "size": file_meta.get("size_bytes"),
            "type": file_meta.get("type"),
        },
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }

    videos.append(video)
    return data


def publish_video(
    data: Dict[str, Any],
    video_id: str,
    *,
    meta: StateMeta,
) -> Dict[str, Any]:
    """Flip a video's status to ``public``."""
    _ = meta
    video = _find_video(data, video_id)
    if video is None:
        raise VideoNotFoundError(video_id)
    video["status"] = "public"
    return data
