# Community

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/comments/inbox
**Depth**: 1

## Overview
The Community page in YouTube Studio is the central hub for managing all community interactions across the channel. It provides tools to moderate comments, review viewer posts, track mentions, and engage with the audience through replies and reactions.

## Main Components

### Tabs
- **Comments**: Manages all comments across channel videos with moderation and filtering tools
- **Viewer posts**: Displays and manages community posts (if enabled)
- **Mentions**: Tracks where the channel has been mentioned by other users

### Comments Tab Features
- **Moderation status filter**: Toggle between Published and Held comments for review
- **Sort options**: Sort by Most relevant (default) or Newest
- **Response status filter**: Filter by Unresponded, Responded, or New replies to your response
- **Search/Filter**: Text-based filtering of comments
- **Batch selection**: Select all or individual comments for bulk actions

### Comment Elements
- User avatar and display name with profile link
- Comment timestamp
- Comment text content
- Video thumbnail and title reference
- Engagement buttons: Reply, View replies, Like, Dislike, Heart
- Action menu with moderation options
- "View comment on YouTube" link

### Action Menu Options
- Remove comment
- Report comment
- Hide user from channel
- Always approve comments from this user
- Add user as managing moderator
- Add user as standard moderator

## Functionality

### Comment Moderation
- Switch between Published and Held queues
- Remove inappropriate comments
- Report violations
- Hide specific users from channel
- Set automatic approval for trusted users
- Assign moderators (managing or standard)

### Engagement
- Reply to comments inline with text editor
- Like/dislike comments
- Heart comments (creator-only feature)
- View and expand reply threads
- Track responded vs unresponded comments

### Filtering & Sorting
- Filter by moderation status (Published/Held)
- Filter by response status (Unresponded/Responded/New replies)
- Sort by relevance or recency
- Text-based search across comments

### Viewer Posts
- Table-based view of community posts
- Published status filter
- Sort functionality
- Filter capability
- Option to enable Community feature

## Interactive Elements

### Dropdowns
- Moderation status (Published/Held)
- Sort by (Most relevant/Newest)
- Response status (Unresponded/Responded/New replies)

### Buttons
- Reply (opens inline reply editor)
- View replies (expands reply thread)
- Like, Dislike, Heart (reaction buttons)
- Action menu (three-dot menu for moderation)
- View comment on YouTube
- Cancel/Reply (in reply interface)

### Tabs
- Comments, Viewer posts, Mentions (main navigation)

### Forms
- Inline reply text editor with Cancel/Submit buttons
- Filter text input

## Notable Observations

### Design Patterns
- Clean, card-based layout for each comment
- Consistent action button placement across all comments
- Responsive design with proper spacing
- Accessible keyboard navigation support

### Technical Details
- Uses ytcp-comment custom elements
- Real-time updates without page refresh
- Batch selection capabilities for bulk moderation
- URL-based state management for filters

### User Experience
- Intuitive tab-based navigation
- Quick access to all moderation tools
- Clear visual hierarchy (comment text, metadata, actions)
- Efficient workflow for managing large comment volumes
- Seamless transition between different comment queues

## Artifacts
- Screenshot: `.spec/info/screenshots/community/community-published-tab-full.png`
- Screenshot: `.spec/info/screenshots/community/community-moderation-dropdown.png`
- Screenshot: `.spec/info/screenshots/community/community-held-tab-empty.png`
- Screenshot: `.spec/info/screenshots/community/community-sort-by-dropdown.png`
- Screenshot: `.spec/info/screenshots/community/community-filter-test.png`
- Screenshot: `.spec/info/screenshots/community/community-action-menu.png`
- Screenshot: `.spec/info/screenshots/community/community-response-status-dropdown.png`
- Screenshot: `.spec/info/screenshots/community/community-viewer-posts-tab-full.png`
- Screenshot: `.spec/info/screenshots/community/community-mentions-tab-empty.png`
- Screenshot: `.spec/info/screenshots/community/community-reply-interface.png`
- Screenshot: `.spec/info/screenshots/community/community-replies-expanded.png`
- Snapshot: `.spec/info/snapshots/community/community-published-tab-snapshot.md`
