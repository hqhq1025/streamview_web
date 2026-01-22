# Base Site State Reference

This document describes the per-user state used by the unified StreamView + Studio site. The
backend stores a `UserState` envelope with a free-form `data` object. All timestamps are ISO
8601 strings (UTC).

## State envelope (UserState)
- `meta.created_at` (string): When the state was created.
- `meta.updated_at` (string): Last update time (patch/merge).
- `meta.version` (number): Incremented on each patch/merge.
- `meta.type` (string): Currently `"unrestricted"`.
- `data` (object): Free-form container for experiment data and UI features.
- `note` (string or null): Optional human-readable note describing the last change.

## Default data shape
The backend initializes `data` with:
- `examples` (object)
  - `huggingface_file` (object)
    - `url` (string): Example dataset URL.
    - `note` (string): Human note about the example.
- `uploads` (Upload[]): Base64 file payloads stored for the current user.
- StreamView mock dataset fields used by the frontend:
  - `user` (object): profile and interaction lists (likes, watch later, subscriptions, history, playlists).
    - `channelId` (string): Creator channel id, used by Studio uploads and the "Your channel" link.
    - `commentReactions` (object): keyed by commentId, values are "like" or "dislike".
  - `videos` (Video[]): catalog of video cards and watch metadata (includes `videoUrl` and `watchUrl`).
    - Studio uploads are stored here with `origin: "studio"` and `asset` metadata.
  - `channels` (Channel[]): channel metadata (avatars, banners, subscriber counts).
  - `comments` (object): keyed by `videoId`, containing comment arrays and replies.
  - `playlists` (Playlist[]): user playlists and video membership.
  - `notifications` (Notification[]): notification feed with read state.
  - `categories` (string[]): home feed filter chips.
  - `userManagement` (object): Comment moderation user lists.
    - `hiddenUsers` (HiddenUser[]): Users hidden from the channel.
    - `managingModerators` (Moderator[]): Users with full moderation permissions.
    - `standardModerators` (Moderator[]): Users with basic moderation permissions.
    - `approvedUsers` (ApprovedUser[]): Users whose comments are always approved.
    - `liveRedirectUsers` (object[]): Users redirected during live streams.
  - `reports` (Report[]): Comment reports submitted by the channel owner.

### Upload (base64)
- `filename` (string)
- `content_type` (string): MIME type (falls back to `application/octet-stream`).
- `size` (number): File size in bytes.
- `content_base64` (string): Data URL, e.g. `data:application/pdf;base64,...`.
- `uploaded_at` (string): ISO timestamp.

### Studio upload video fields (in `data.videos`)
- `origin` (string): `"studio"` for Studio-created videos.
- `id` / `videoId` (string): Video ids.
- `title`, `description`, `visibility`, `status` (string)
- `uploaded_at`, `uploadDate` (string)
- `channelId`, `channelName`, `channelAvatar` (string)
- `asset` (object): File metadata captured from `/api/files`.

### Asset
- `id` (string): File id assigned by the backend.
- `original_filename` (string): Original file name.
- `stored_filename` (string): Stored filename (id + original name).
- `content_type` (string): MIME type (falls back to `application/octet-stream`).
- `size_bytes` (number): File size in bytes.
- `url` (string): `/api/files/<stored_name>` or external URL.
- `content_md5` (string): MD5 hash (hex) of the file contents.

### HiddenUser
- `userId` (string): User id of the hidden user.
- `userName` (string): Display name of the hidden user.
- `userAvatar` (string): Avatar URL of the hidden user.
- `hiddenAt` (string): ISO timestamp when the user was hidden.

### Moderator
- `userId` (string): User id of the moderator.
- `userName` (string): Display name of the moderator.
- `userAvatar` (string): Avatar URL of the moderator.
- `addedAt` (string): ISO timestamp when the moderator was added.

### Report
- `reportId` (string): Unique report identifier.
- `commentId` (string): Id of the reported comment.
- `reason` (string): Reason for the report (spam, harassment, hate_speech, misinformation, privacy, impersonation, violence, child_safety, other).
- `details` (string): Optional additional details provided by the reporter.
- `status` (string): Report status (pending, reviewed, dismissed).
- `reportedAt` (string): ISO timestamp when the report was submitted.
- `commentText` (string): Text of the reported comment.
- `commentUserId` (string): User id of the comment author.
- `commentUserName` (string): Display name of the comment author.
- `videoId` (string): Video id where the comment was posted.

## Full example (UserState)
```json
{
  "meta": {
    "created_at": "2024-04-01T12:00:00+00:00",
    "updated_at": "2024-04-01T12:30:00+00:00",
    "version": 2,
    "type": "unrestricted"
  },
  "data": {
    "examples": {
      "huggingface_file": {
        "url": "https://huggingface.co/datasets/adlsdztony/osworld-v2/blob/main/email_031.tar.gz",
        "note": "Initial example file reference (no verification)."
      }
    },
    "uploads": [],
    "user": {
      "userId": "user-1",
      "displayName": "Alex Thompson",
      "channelId": "user-1",
      "commentReactions": { "comment-123": "like" }
    },
    "videos": [
      {
        "videoId": "upload-abc123",
        "title": "Launch teaser",
        "visibility": "Private",
        "origin": "studio",
        "asset": { "id": "abc123", "url": "/api/files/abc123__teaser.mp4" }
      }
    ],
    "channels": [{ "channelId": "user-1", "name": "Alex Thompson" }],
    "comments": { "video-1": [] },
    "playlists": [],
    "notifications": [],
    "categories": ["All", "Gaming", "Music"],
    "userManagement": {
      "hiddenUsers": [
        {
          "userId": "spam-user-1",
          "userName": "SpamBot",
          "userAvatar": "https://example.com/avatar.png",
          "hiddenAt": "2024-04-01T12:00:00+00:00"
        }
      ],
      "managingModerators": [
        {
          "userId": "mod-1",
          "userName": "Trusted Mod",
          "userAvatar": "https://example.com/mod-avatar.png",
          "addedAt": "2024-04-01T10:00:00+00:00"
        }
      ],
      "standardModerators": [],
      "approvedUsers": [],
      "liveRedirectUsers": []
    },
    "reports": [
      {
        "reportId": "report-abc123",
        "commentId": "comment-456",
        "reason": "spam",
        "details": "Promoting unrelated products",
        "status": "pending",
        "reportedAt": "2024-04-01T12:15:00+00:00",
        "commentText": "Check out my website!",
        "commentUserId": "spam-user-2",
        "commentUserName": "SpamAccount",
        "videoId": "video-1"
      }
    ]
  },
  "note": "Seeded default example data"
}
```
