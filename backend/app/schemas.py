from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field

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


class StrictProductRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")


class VideoActionRequest(StrictProductRequest):
    video_id: str


class CommentRequest(StrictProductRequest):
    video_id: str
    text: str
    parent_comment_id: Optional[str] = None


class PlaylistCreateRequest(StrictProductRequest):
    name: str
    description: Optional[str] = ""
    privacy: str = "Public"


class UserManagementRequest(StrictProductRequest):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = ""


class ModeratorRequest(StrictProductRequest):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = ""
    moderator_type: str = "standard"  # "managing" or "standard"


class ReportCommentRequest(StrictProductRequest):
    reason: str
    details: Optional[str] = ""


class VideoUpdateRequest(StrictProductRequest):
    title: Optional[str] = None
    description: Optional[str] = None
    visibility: Optional[str] = None
