from __future__ import annotations

import copy
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .youtube_seed import get_default_youtube_state


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


def _ensure_youtube_data(data: Dict[str, Any]) -> Dict[str, Any]:
    base = get_default_youtube_state()
    return _deep_merge(base, data or {})


def _find_index(items: List[Dict[str, Any]], key: str, value: str) -> Optional[int]:
    for idx, item in enumerate(items):
        if item.get(key) == value:
            return idx
    return None


def toggle_like(data: Dict[str, Any], video_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    videos = list(data.get("videos", []))
    idx = _find_index(videos, "videoId", video_id)
    if idx is None:
        raise ValueError(f"Video not found: {video_id}")

    user = dict(data.get("user", {}))
    liked_videos = list(user.get("likedVideos", []))
    disliked_videos = list(user.get("dislikedVideos", []))
    is_liked = video_id in liked_videos

    if is_liked:
        liked_videos = [vid for vid in liked_videos if vid != video_id]
        videos[idx]["likeCount"] = max(0, int(videos[idx].get("likeCount", 0)) - 1)
    else:
        liked_videos.append(video_id)
        videos[idx]["likeCount"] = int(videos[idx].get("likeCount", 0)) + 1
        if video_id in disliked_videos:
            disliked_videos = [vid for vid in disliked_videos if vid != video_id]
            videos[idx]["dislikeCount"] = max(
                0, int(videos[idx].get("dislikeCount", 0)) - 1
            )

    user["likedVideos"] = liked_videos
    user["dislikedVideos"] = disliked_videos
    data["user"] = user
    data["videos"] = videos
    return data


def toggle_dislike(data: Dict[str, Any], video_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    videos = list(data.get("videos", []))
    idx = _find_index(videos, "videoId", video_id)
    if idx is None:
        raise ValueError(f"Video not found: {video_id}")

    user = dict(data.get("user", {}))
    disliked_videos = list(user.get("dislikedVideos", []))
    liked_videos = list(user.get("likedVideos", []))
    is_disliked = video_id in disliked_videos

    if is_disliked:
        disliked_videos = [vid for vid in disliked_videos if vid != video_id]
        videos[idx]["dislikeCount"] = max(
            0, int(videos[idx].get("dislikeCount", 0)) - 1
        )
    else:
        disliked_videos.append(video_id)
        videos[idx]["dislikeCount"] = int(videos[idx].get("dislikeCount", 0)) + 1
        if video_id in liked_videos:
            liked_videos = [vid for vid in liked_videos if vid != video_id]
            videos[idx]["likeCount"] = max(0, int(videos[idx].get("likeCount", 0)) - 1)

    user["dislikedVideos"] = disliked_videos
    user["likedVideos"] = liked_videos
    data["user"] = user
    data["videos"] = videos
    return data


def toggle_watch_later(data: Dict[str, Any], video_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    videos = list(data.get("videos", []))
    if _find_index(videos, "videoId", video_id) is None:
        raise ValueError(f"Video not found: {video_id}")

    user = dict(data.get("user", {}))
    watch_later = list(user.get("watchLater", []))
    if video_id in watch_later:
        watch_later = [vid for vid in watch_later if vid != video_id]
    else:
        watch_later.append(video_id)
    user["watchLater"] = watch_later
    data["user"] = user
    return data


def toggle_subscription(data: Dict[str, Any], channel_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    channels = list(data.get("channels", []))
    idx = _find_index(channels, "channelId", channel_id)
    if idx is None:
        raise ValueError(f"Channel not found: {channel_id}")

    user = dict(data.get("user", {}))
    subscribed = list(user.get("subscribedChannels", []))
    is_subscribed = channel_id in subscribed

    if is_subscribed:
        subscribed = [cid for cid in subscribed if cid != channel_id]
        channels[idx]["subscriberCount"] = max(
            0, int(channels[idx].get("subscriberCount", 0)) - 1
        )
    else:
        subscribed.append(channel_id)
        channels[idx]["subscriberCount"] = int(channels[idx].get("subscriberCount", 0)) + 1

    user["subscribedChannels"] = subscribed
    data["user"] = user
    data["channels"] = channels
    return data


def add_watch_history(data: Dict[str, Any], video_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    videos = list(data.get("videos", []))
    idx = _find_index(videos, "videoId", video_id)
    if idx is None:
        raise ValueError(f"Video not found: {video_id}")

    user = dict(data.get("user", {}))
    history = list(user.get("watchHistory", []))
    history = [entry for entry in history if entry.get("videoId") != video_id]
    history.insert(
        0, {"videoId": video_id, "watchedAt": datetime.now(timezone.utc).isoformat()}
    )

    user["watchHistory"] = history
    data["user"] = user
    videos[idx]["viewCount"] = int(videos[idx].get("viewCount", 0)) + 1
    data["videos"] = videos
    return data


def remove_from_history(data: Dict[str, Any], video_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    user = dict(data.get("user", {}))
    history = list(user.get("watchHistory", []))
    history = [entry for entry in history if entry.get("videoId") != video_id]
    user["watchHistory"] = history
    data["user"] = user
    return data


def clear_history(data: Dict[str, Any]) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    user = dict(data.get("user", {}))
    user["watchHistory"] = []
    data["user"] = user
    return data


def add_comment(
    data: Dict[str, Any],
    video_id: str,
    text: str,
    parent_comment_id: Optional[str] = None,
) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    videos = list(data.get("videos", []))
    if _find_index(videos, "videoId", video_id) is None:
        raise ValueError(f"Video not found: {video_id}")

    user = dict(data.get("user", {}))
    comments = dict(data.get("comments", {}))
    comment_list = list(comments.get(video_id, []))

    new_comment = {
        "commentId": f"comment-{uuid.uuid4().hex}",
        "videoId": video_id,
        "userId": user.get("userId"),
        "userName": user.get("displayName"),
        "userAvatar": user.get("avatar"),
        "text": text,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "likeCount": 0,
        "dislikeCount": 0,
        "replies": [],
        "isPinned": False,
        "isHearted": False,
        "status": "published",
    }

    if parent_comment_id:
        updated_list = []
        inserted = False
        for comment in comment_list:
            if comment.get("commentId") == parent_comment_id:
                replies = list(comment.get("replies", []))
                replies.append(new_comment)
                comment = {**comment, "replies": replies}
                inserted = True
            updated_list.append(comment)
        if not inserted:
            updated_list = [new_comment] + comment_list
        comment_list = updated_list
    else:
        comment_list = [new_comment] + comment_list

    comments[video_id] = comment_list
    data["comments"] = comments
    return data


def _ensure_comment_fields(comment: Dict[str, Any]) -> Dict[str, Any]:
    if "likeCount" not in comment:
        comment["likeCount"] = 0
    if "dislikeCount" not in comment:
        comment["dislikeCount"] = 0
    if "isHearted" not in comment:
        comment["isHearted"] = False
    if "status" not in comment:
        comment["status"] = "published"
    if "replies" not in comment:
        comment["replies"] = []
    return comment


def _find_comment_location(
    comments: Dict[str, List[Dict[str, Any]]], comment_id: str
) -> Optional[tuple[str, List[Dict[str, Any]], int]]:
    def _search(comment_list: List[Dict[str, Any]]) -> Optional[tuple[List[Dict[str, Any]], int]]:
        for idx, comment in enumerate(comment_list):
            if comment.get("commentId") == comment_id:
                return comment_list, idx
            replies = comment.get("replies", [])
            result = _search(replies)
            if result:
                return result
        return None

    for video_id, comment_list in comments.items():
        result = _search(comment_list)
        if result:
            return video_id, result[0], result[1]
    return None


def toggle_comment_reaction(
    data: Dict[str, Any], comment_id: str, reaction: str
) -> Dict[str, Any]:
    if reaction not in ("like", "dislike"):
        raise ValueError("Reaction must be like or dislike")
    data = _ensure_youtube_data(data)
    comments = dict(data.get("comments", {}))
    location = _find_comment_location(comments, comment_id)
    if not location:
        raise ValueError(f"Comment not found: {comment_id}")
    _, parent_list, idx = location
    comment = _ensure_comment_fields(dict(parent_list[idx]))

    user = dict(data.get("user", {}))
    reactions = dict(user.get("commentReactions", {}))
    current = reactions.get(comment_id)

    if current == reaction:
        if reaction == "like":
            comment["likeCount"] = max(0, int(comment.get("likeCount", 0)) - 1)
        else:
            comment["dislikeCount"] = max(0, int(comment.get("dislikeCount", 0)) - 1)
        reactions.pop(comment_id, None)
    else:
        if current == "like":
            comment["likeCount"] = max(0, int(comment.get("likeCount", 0)) - 1)
        elif current == "dislike":
            comment["dislikeCount"] = max(0, int(comment.get("dislikeCount", 0)) - 1)

        if reaction == "like":
            comment["likeCount"] = int(comment.get("likeCount", 0)) + 1
        else:
            comment["dislikeCount"] = int(comment.get("dislikeCount", 0)) + 1
        reactions[comment_id] = reaction

    parent_list[idx] = comment
    user["commentReactions"] = reactions
    data["user"] = user
    data["comments"] = comments
    return data


def toggle_comment_heart(data: Dict[str, Any], comment_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    comments = dict(data.get("comments", {}))
    location = _find_comment_location(comments, comment_id)
    if not location:
        raise ValueError(f"Comment not found: {comment_id}")
    _, parent_list, idx = location
    comment = _ensure_comment_fields(dict(parent_list[idx]))
    comment["isHearted"] = not bool(comment.get("isHearted"))
    parent_list[idx] = comment
    data["comments"] = comments
    return data


def remove_comment(data: Dict[str, Any], comment_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    comments = dict(data.get("comments", {}))
    location = _find_comment_location(comments, comment_id)
    if not location:
        raise ValueError(f"Comment not found: {comment_id}")
    _, parent_list, idx = location
    parent_list.pop(idx)

    user = dict(data.get("user", {}))
    reactions = dict(user.get("commentReactions", {}))
    if comment_id in reactions:
        reactions.pop(comment_id, None)
        user["commentReactions"] = reactions
        data["user"] = user

    data["comments"] = comments
    return data


def create_playlist(
    data: Dict[str, Any],
    name: str,
    description: str,
    privacy: str,
) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    user = dict(data.get("user", {}))
    playlists = list(data.get("playlists", []))
    playlist_id = f"playlist-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()

    playlists.append(
        {
            "playlistId": playlist_id,
            "name": name,
            "description": description,
            "creatorId": user.get("userId"),
            "videoIds": [],
            "privacy": privacy,
            "createdDate": now,
            "thumbnail": f"https://picsum.photos/640/360?random={playlist_id}",
        }
    )

    user_playlists = list(user.get("playlists", []))
    user_playlists.append(playlist_id)
    user["playlists"] = user_playlists

    data["user"] = user
    data["playlists"] = playlists
    return data


def toggle_playlist_video(data: Dict[str, Any], playlist_id: str, video_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    playlists = list(data.get("playlists", []))
    idx = _find_index(playlists, "playlistId", playlist_id)
    if idx is None:
        raise ValueError(f"Playlist not found: {playlist_id}")

    video_ids = list(playlists[idx].get("videoIds", []))
    if video_id in video_ids:
        video_ids = [vid for vid in video_ids if vid != video_id]
    else:
        video_ids.append(video_id)

    playlists[idx] = {**playlists[idx], "videoIds": video_ids}
    data["playlists"] = playlists
    return data


def mark_notification_read(data: Dict[str, Any], notification_id: str) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    notifications = list(data.get("notifications", []))
    idx = _find_index(notifications, "notificationId", notification_id)
    if idx is None:
        raise ValueError(f"Notification not found: {notification_id}")
    notifications[idx] = {**notifications[idx], "isRead": True}
    data["notifications"] = notifications
    return data


def mark_all_notifications_read(data: Dict[str, Any]) -> Dict[str, Any]:
    data = _ensure_youtube_data(data)
    notifications = [
        {**notification, "isRead": True} for notification in data.get("notifications", [])
    ]
    data["notifications"] = notifications
    return data


def _ensure_user_management(data: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure user management fields exist in data."""
    if "userManagement" not in data:
        data["userManagement"] = {
            "hiddenUsers": [],
            "managingModerators": [],
            "standardModerators": [],
            "approvedUsers": [],
            "liveRedirectUsers": [],
        }
    return data


def _remove_user_comments(data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """Remove all comments by a user from all videos."""
    comments = dict(data.get("comments", {}))

    def filter_comments(comment_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        filtered = []
        for comment in comment_list:
            if comment.get("userId") == user_id:
                continue
            # Filter replies too
            replies = list(comment.get("replies", []))
            filtered_replies = [r for r in replies if r.get("userId") != user_id]
            comment = {**comment, "replies": filtered_replies}
            filtered.append(comment)
        return filtered

    for video_id in comments:
        comments[video_id] = filter_comments(list(comments[video_id]))

    data["comments"] = comments
    return data


def hide_user(data: Dict[str, Any], user_id: str, user_name: str, user_avatar: str = "") -> Dict[str, Any]:
    """Add a user to the hidden users list and remove all their comments."""
    data = _ensure_youtube_data(data)
    data = _ensure_user_management(data)

    hidden_users = list(data["userManagement"].get("hiddenUsers", []))

    # Check if user is already hidden
    if any(u.get("userId") == user_id for u in hidden_users):
        return data

    # Add user to hidden list
    hidden_users.append({
        "userId": user_id,
        "userName": user_name,
        "userAvatar": user_avatar,
        "hiddenAt": datetime.now(timezone.utc).isoformat(),
    })
    data["userManagement"]["hiddenUsers"] = hidden_users

    # Remove all comments by this user
    data = _remove_user_comments(data, user_id)

    return data


def unhide_user(data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """Remove a user from the hidden users list."""
    data = _ensure_youtube_data(data)
    data = _ensure_user_management(data)

    hidden_users = list(data["userManagement"].get("hiddenUsers", []))
    hidden_users = [u for u in hidden_users if u.get("userId") != user_id]
    data["userManagement"]["hiddenUsers"] = hidden_users

    return data


def add_moderator(
    data: Dict[str, Any],
    user_id: str,
    user_name: str,
    user_avatar: str = "",
    moderator_type: str = "standard"
) -> Dict[str, Any]:
    """Add a user as a moderator (managing or standard)."""
    data = _ensure_youtube_data(data)
    data = _ensure_user_management(data)

    key = "managingModerators" if moderator_type == "managing" else "standardModerators"
    moderators = list(data["userManagement"].get(key, []))

    # Check if user is already a moderator
    if any(u.get("userId") == user_id for u in moderators):
        return data

    moderators.append({
        "userId": user_id,
        "userName": user_name,
        "userAvatar": user_avatar,
        "addedAt": datetime.now(timezone.utc).isoformat(),
    })
    data["userManagement"][key] = moderators

    return data


def remove_moderator(data: Dict[str, Any], user_id: str, moderator_type: str = "standard") -> Dict[str, Any]:
    """Remove a user from moderators list."""
    data = _ensure_youtube_data(data)
    data = _ensure_user_management(data)

    key = "managingModerators" if moderator_type == "managing" else "standardModerators"
    moderators = list(data["userManagement"].get(key, []))
    moderators = [u for u in moderators if u.get("userId") != user_id]
    data["userManagement"][key] = moderators

    return data


def report_comment(
    data: Dict[str, Any],
    comment_id: str,
    reason: str,
    details: str = ""
) -> Dict[str, Any]:
    """Report a comment for review and remove it."""
    data = _ensure_youtube_data(data)

    # Ensure reports list exists
    if "reports" not in data:
        data["reports"] = []

    reports = list(data.get("reports", []))
    report_id = f"report-{uuid.uuid4().hex}"

    # Find the comment to get additional info
    comments = dict(data.get("comments", {}))
    location = _find_comment_location(comments, comment_id)
    comment_info = {}
    if location:
        _, parent_list, idx = location
        comment = parent_list[idx]
        comment_info = {
            "commentText": comment.get("text", ""),
            "commentUserId": comment.get("userId", ""),
            "commentUserName": comment.get("userName", ""),
            "videoId": comment.get("videoId", ""),
        }

    reports.append({
        "reportId": report_id,
        "commentId": comment_id,
        "reason": reason,
        "details": details,
        "status": "pending",
        "reportedAt": datetime.now(timezone.utc).isoformat(),
        **comment_info,
    })
    data["reports"] = reports

    # Remove the reported comment
    data = remove_comment(data, comment_id)

    return data
