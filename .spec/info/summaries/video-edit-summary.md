# Video Edit Page

**URL**: https://studio.youtube.com/video/kziDjgXLyN0/edit
**Depth**: 1

## Overview
The Video Edit page is a comprehensive interface for managing individual video content. It features a left sidebar navigation with 6 main tabs (Details, Analytics, Editor, Comments, Copyright, Clips) and provides extensive tools for video management, editing, and optimization.

## Main Components

### Left Sidebar Navigation
- **Channel Content**: Breadcrumb button to return to content list
- **Video Preview**: Thumbnail, duration, and title display
- **Navigation Menu**:
  - Details (default): Video metadata and settings
  - Analytics: Performance metrics and insights
  - Editor: Timeline-based video editing tools
  - Comments: Comment management and moderation
  - Copyright: Copyright status and content ID
  - Clips: Create short clips from existing video

### Details Tab Components

#### Video Metadata Section
- **Title**: Required text input with @ mention capability for channels
- **Description**: Multi-line textarea for video description
- **Thumbnail Options**:
  - Upload file (with recommendations: 1280x720, <2MB, JPG/PNG/GIF)
  - Auto-generated thumbnails from video
  - Test & compare for A/B testing thumbnails
- **Playlists**: Add to playlist selector
- **Audience**: Made for kids settings (Yes/No radio buttons with legal compliance info)
- **Age Restriction (Advanced)**: Optional age gating

#### Video Preview Panel
- Embedded video player with full controls
- Video link with copy button
- Filename display
- Video quality indicator (SD/HD/4K)
- Visibility status (Public/Private/Unlisted/Scheduled)
- Restrictions indicator
- Subtitles, End screen, and Cards management buttons

#### Action Buttons
- Undo changes (disabled until edits made)
- Save (disabled until edits made)
- Options menu (additional actions)

## Functionality

### Details Tab
- Edit video title and description
- Upload or select thumbnail
- Manage playlist assignments
- Set audience targeting (COPPA compliance)
- Configure visibility and restrictions
- Access subtitles, end screens, and cards
- Copy video link

### Analytics Tab
- Overview: Views, watch time, subscribers metrics
- Reach: Impression and click-through data
- Engagement: Audience retention and interaction
- Audience: Demographics and viewer behavior
- Realtime views: Last 60 minutes activity
- Advanced mode link for detailed analysis

### Comments Tab
- View all comments with author info
- Filter by published status
- Sort by relevance or time
- Filter by response status (responded/unresponded)
- Reply, like, dislike, heart individual comments
- Batch moderation with checkboxes
- View comment on YouTube link

### Editor Tab
- Timeline-based video editor
- Trim & cut: Remove sections from video
- Blur: Blur faces or objects in video
- Audio: Add or replace audio tracks
- End screen: Add end screen elements
- Info cards: Add interactive cards
- Video clip: Create short clips from video
- Video preview with timeline controls
- Undo/Redo functionality
- Zoom controls for timeline

### Copyright Tab
- Copyright status summary
- Channel impact information
- Visibility restrictions notice
- Content used breakdown (if any claims)

### Clips Tab
- Create video clips from existing content
- Table display of created clips
- Empty state with "Create video clip" CTA
- Learn more resources

## Interactive Elements

### Navigation
- Left sidebar for quick tab switching
- Channel content breadcrumb to return to list
- Active tab highlighting

### Form Controls
- Text inputs (title, filter)
- Textarea (description)
- Radio buttons (audience settings)
- Buttons (save, undo, options)
- Dropdowns (visibility, playlists, sort, filter)

### Media Player
- Play/pause controls
- Volume slider
- Fullscreen button
- Settings menu
- Timeline scrubbing in Editor

### Quick Actions
- Copy video link
- Edit visibility
- Manage subtitles
- Configure end screens
- Add info cards

## Notable Observations

### Design Patterns
- Split layout with navigation on left, content on right
- Consistent iconography across all tabs
- Clear visual hierarchy with headings and sections
- Responsive design with proper spacing
- Empty states provide helpful guidance

### User Experience
- Intuitive workflow from content list to editing
- All video management tools in one place
- Contextual help and learn more links
- Auto-save indicators (save button enables on changes)
- Legal compliance guidance for COPPA

### Technical Details
- URL structure reflects video ID and active tab
- State management through URL parameters
- Dynamic content loading for each tab
- Accessibility features with proper ARIA labels
- Real-time updates for video statistics

### Integration Points
- Links to YouTube for public view
- Links to support documentation
- Integration with YouTube's Content ID system
- Connection to channel's video library

## Sub-pages
- Analytics (with 4 sub-tabs: Overview, Reach, Engagement, Audience)
- Comments (with filtering and moderation tools)
- Editor (timeline-based editing interface)
- Copyright (content ID and claim management)
- Clips (clip creation and management)

## Artifacts
- Screenshot: `.spec/info/screenshots/video-edit-details-tab.png`
- Snapshot: `.spec/info/snapshots/video-edit-details-tab.md`
- Additional tab screenshots: Analytics, Comments, Editor, Copyright, Clips tabs captured
