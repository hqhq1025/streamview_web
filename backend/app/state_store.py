import asyncio
import copy
from typing import Any, Callable, Dict, Optional

from .models import UserState

VALID_VISIBILITIES = ("public", "unlisted", "private")


def _deep_merge(dest: Dict[str, Any], src: Dict[str, Any]) -> Dict[str, Any]:
    for key, value in src.items():
        if (
            key in dest
            and isinstance(dest[key], dict)
            and isinstance(value, dict)
        ):
            dest[key] = _deep_merge(dest[key], value)
        else:
            dest[key] = copy.deepcopy(value)
    return dest


def _normalize_videos(data: Dict[str, Any]) -> None:
    """Ensure every video carries the fields required by the v2 evaluator contract.

    Runs on state read/write boundaries so seed data and newly inserted records
    both surface identical shapes, without forcing every writer to set defaults.
    """
    videos = data.get("videos")
    if not isinstance(videos, list):
        return
    for video in videos:
        if not isinstance(video, dict):
            continue
        video.setdefault("description", "")
        video.setdefault("tags", [])
        video.setdefault("status", "draft")
        raw_visibility = video.get("visibility")
        if isinstance(raw_visibility, str):
            lowered = raw_visibility.strip().lower()
            video["visibility"] = lowered if lowered in VALID_VISIBILITIES else "public"
        else:
            video["visibility"] = "public"


class StateStore:
    """In-memory state store keyed by user id."""

    def __init__(self) -> None:
        self._states: Dict[str, UserState] = {}
        self._lock = asyncio.Lock()

    async def get_state(self, user_id: str) -> UserState:
        async with self._lock:
            state = self._states.get(user_id)
            if state is None:
                state = UserState()
                self._states[user_id] = state
            _normalize_videos(state.data)
            return state

    async def replace_state(self, user_id: str, new_state: Dict[str, Any]) -> UserState:
        async with self._lock:
            state = UserState(**new_state)
            _normalize_videos(state.data)
            self._states[user_id] = state
            return state

    async def patch_state(self, user_id: str, patch: Dict[str, Any], note: Optional[str]) -> UserState:
        async with self._lock:
            state = self._states.get(user_id, UserState())
            updated_data = _deep_merge(copy.deepcopy(state.data), patch)
            _normalize_videos(updated_data)
            state.data = updated_data
            if note is not None:
                state.note = note
            state.touch()
            self._states[user_id] = state
            return state

    async def mutate_data(
        self,
        user_id: str,
        mutator: Callable[[Dict[str, Any]], Dict[str, Any]],
        note: Optional[str] = None,
    ) -> UserState:
        async with self._lock:
            state = self._states.get(user_id, UserState())
            data_copy = copy.deepcopy(state.data)
            updated_data = mutator(data_copy) or data_copy
            _normalize_videos(updated_data)
            state.data = updated_data
            if note is not None:
                state.note = note
            state.touch()
            self._states[user_id] = state
            return state

    async def reset_state(self, user_id: str) -> UserState:
        async with self._lock:
            state = UserState()
            _normalize_videos(state.data)
            self._states[user_id] = state
            return state

    async def delete_state(self, user_id: str) -> None:
        async with self._lock:
            self._states.pop(user_id, None)
