import asyncio
import copy
from typing import Any, Callable, Dict, Optional

from .models import UserState
from .state_limits import BoundedStateStoreMixin

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


class StateStore(BoundedStateStoreMixin):
    """In-memory state store keyed by user id."""

    def __init__(
        self,
        *,
        ttl_seconds: Optional[float] = None,
        max_entries: Optional[int] = None,
        max_total_bytes: Optional[int] = None,
        clock: Optional[Callable[[], float]] = None,
    ) -> None:
        self._states: Dict[str, UserState] = {}
        self._lock = asyncio.Lock()
        self._init_state_limits(
            ttl_seconds=ttl_seconds,
            max_entries=max_entries,
            max_total_bytes=max_total_bytes,
            clock=clock,
        )

    async def get_state(self, user_id: str) -> UserState:
        async with self._lock:
            now = self._prepare_state_access()
            state = self._states.get(user_id)
            if state is None:
                state = UserState()
            _normalize_videos(state.data)
            return self._store_state(user_id, state, now)

    async def replace_state(self, user_id: str, new_state: Dict[str, Any]) -> UserState:
        async with self._lock:
            now = self._prepare_state_access()
            state = UserState(**new_state)
            _normalize_videos(state.data)
            return self._store_state(user_id, state, now)

    async def patch_state(self, user_id: str, patch: Dict[str, Any], note: Optional[str]) -> UserState:
        async with self._lock:
            now = self._prepare_state_access()
            state = self._states.get(user_id, UserState())
            updated_data = _deep_merge(copy.deepcopy(state.data), patch)
            _normalize_videos(updated_data)
            state.data = updated_data
            if note is not None:
                state.note = note
            state.touch()
            return self._store_state(user_id, state, now)

    async def mutate_data(
        self,
        user_id: str,
        mutator: Callable[[Dict[str, Any]], Dict[str, Any]],
        note: Optional[str] = None,
    ) -> UserState:
        async with self._lock:
            now = self._prepare_state_access()
            state = self._states.get(user_id, UserState())
            data_copy = copy.deepcopy(state.data)
            updated_data = mutator(data_copy) or data_copy
            _normalize_videos(updated_data)
            state.data = updated_data
            if note is not None:
                state.note = note
            state.touch()
            return self._store_state(user_id, state, now)

    async def reset_state(self, user_id: str) -> UserState:
        async with self._lock:
            now = self._prepare_state_access()
            state = UserState()
            _normalize_videos(state.data)
            return self._store_state(user_id, state, now)

    async def delete_state(self, user_id: str) -> None:
        async with self._lock:
            self._remove_tracked_state(user_id)
