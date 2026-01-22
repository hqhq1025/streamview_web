# Subtitles Page

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/subtitles
**Depth**: 1

## Overview
The Subtitles page (also called Translations page) allows channel owners to manage closed captions and subtitles for their videos. It provides a channel-level view of all videos and their subtitle status, as well as detailed subtitle management for individual videos.

## Main Components

### Channel Subtitles View
- **Page Header**: "Channel subtitles" title with navigation
- **Tab Selection**: Three tabs for filtering videos
  - All: Shows all videos
  - Drafts: Shows videos with draft subtitles
  - Published: Shows videos with published subtitles
- **Videos Table**: Displays all channel videos with subtitle information
  - Video column: Thumbnail, title, and video ID
  - Languages column: Number of subtitle languages
  - Modified on column: Last modification date
- **Table Navigation**: Pagination controls for browsing through videos

### Video Subtitles View
- **Breadcrumb Navigation**: Link back to "Channel subtitles"
- **Video Context**: Thumbnail and video title in sidebar
- **Language Settings**:
  - Set language dropdown with 150+ language options
  - "Make this the default for my channel" checkbox
  - Confirm button to save language selection
- **Translations Table**: Columns for:
  - Language: Shows subtitle languages with "(video language)" marker
  - Subtitles: Status of subtitle tracks (shows "–" if none)
  - Title & description: Translation status for metadata
- **Add Language Button**: Opens dropdown to add new subtitle languages

## Functionality

### Language Selection
- Comprehensive language dropdown with 150+ languages including:
  - Major languages (English, Spanish, Chinese, etc.)
  - Regional variants (English (US), English (UK), Portuguese (Brazil), etc.)
  - Specialized languages (American Sign Language, Klingon, etc.)
- Disabled options for already selected languages
- Default channel setting option

### Subtitle Management
- View all videos and their subtitle status at a glance
- Click on any video to manage its subtitles
- Add multiple language tracks to a single video
- Track modification dates for subtitle changes

### Filtering
- Filter videos by subtitle status (All, Drafts, Published)
- Quick identification of videos needing subtitles

## Interactive Elements

### Buttons
- Set language button (opens language selector)
- Confirm button (saves language selection)
- Add language button (opens language selector for new track)
- Tab navigation (All, Drafts, Published)
- Pagination controls (first, previous, next, last)

### Links
- Video thumbnails and titles (navigate to video subtitle management)
- Channel subtitles breadcrumb (returns to channel view)

### Dropdowns
- Language selector with scrollable list
- Search/filter functionality (implied by large list)

## Notable Observations

### Design Patterns
- Clean table-based layout for efficient video browsing
- Consistent use of dropdowns for language selection
- Visual indicators for video language vs. translation languages
- Disabled state for already-selected languages in add dropdown

### User Experience
- "All changes saved" toast notification after setting language
- Smooth navigation between channel and video-level views
- Clear visual hierarchy with video thumbnails
- Responsive table layout with proper alignment

### Technical Details
- URL structure: `/channel/{id}/translations` for channel view
- URL structure: `/video/{id}/translations` for video view
- State persists when navigating between videos
- Language selection is video-specific
- Channel-wide default language setting available

### Content Management
- Supports 150+ languages
- Tracks modification dates
- Distinguishes between video language and translations
- Draft and published states for subtitle tracks
- Zero language count displayed when no subtitles added

## Artifacts
- Screenshot: `screenshots/subtitles/subtitles-full.png`
- Screenshot: `screenshots/subtitles/subtitles-video-detail-full.png`
- Screenshot: `screenshots/subtitles/subtitles-language-dropdown.png`
- Screenshot: `screenshots/subtitles/subtitles-language-selected.png`
- Screenshot: `screenshots/subtitles/subtitles-add-language-view.png`
- Screenshot: `screenshots/subtitles/subtitles-add-language-dropdown.png`
- Snapshot: `snapshots/subtitles/subtitles-snapshot.md`
