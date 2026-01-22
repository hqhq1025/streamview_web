from typing import Any, Dict, Optional

from pydantic import BaseModel, Field

from .models import StateMeta, UserState


class StateRequest(BaseModel):
    data: Dict[str, Any] = Field(default_factory=dict)
    note: Optional[str] = None
    meta: Optional[StateMeta] = None


class StatePatchRequest(BaseModel):
    data: Dict[str, Any] = Field(default_factory=dict)
    note: Optional[str] = None


class StateResponse(BaseModel):
    user_id: str
    state: UserState


class InfoResponse(BaseModel):
    app_name: str
    python_version: str
    env: Dict[str, str]
    request: Dict[str, Any]


class VideoActionRequest(BaseModel):
    video_id: str


class CommentRequest(BaseModel):
    video_id: str
    text: str
    parent_comment_id: Optional[str] = None


class PlaylistCreateRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    privacy: str = "Public"


class UserManagementRequest(BaseModel):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = ""


class ModeratorRequest(BaseModel):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = ""
    moderator_type: str = "standard"  # "managing" or "standard"


class ReportCommentRequest(BaseModel):
    reason: str
    details: Optional[str] = ""
