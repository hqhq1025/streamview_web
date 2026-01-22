# Content Page

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/content
**Depth**: 0

## Overview
The Content page is the main hub for managing all channel content on YouTube Studio. It provides a comprehensive tabbed interface to organize and manage different types of content including videos, shorts, live streams, posts, playlists, podcasts, promotions, and collaborations.

## Main Components

### Tab Navigation
The page features a horizontal tab list with 8 content type tabs:
- **Videos**: Main video content management
- **Shorts**: Short-form video content (under 60 seconds)
- **Live**: Live stream content management
- **Posts**: Community posts
- **Playlists**: Video playlist organization
- **Podcasts**: Podcast content management
- **Promotions**: Promotional content and campaigns
- **Collaborations**: Collaborative video projects

### Content Table (Videos Tab)
The default Videos tab displays a comprehensive table with columns:
- **Video**: Thumbnail, title, duration, and video count indicator
- **Visibility**: Public/Private/Unlisted/Scheduled status
- **Restrictions**: Content restrictions or warnings
- **Date**: Upload or publish date (sortable)
- **Views**: Total view count (sortable)
- **Comments**: Number of comments with link to comments page
- **Likes (vs. dislikes)**: Like ratio and count

### Filter and Search
- Filter textbox in table header for searching content
- Column headers are clickable for sorting (Date, Views, Comments, Likes)
- Rows per page selector (default: 30)
- Pagination controls for large content libraries

## Functionality

### Content Management
- View all channel content in organized tabs
- Click video thumbnail or title to edit video details
- Access comments directly from the table
- Filter and sort content by various metrics
- Navigate to specific content types quickly

### Quick Actions
- Upload videos button (visible on empty tabs)
- Create post button (Posts tab)
- New playlist button (Playlists tab)
- New podcast button (Podcasts tab)
- Get started button (Live and Promotions tabs)

## Interactive Elements

### Navigation
- Breadcrumb navigation back to channel content
- Left sidebar with main Studio navigation
- Channel content button to return to main list

### Video Actions
- Click video thumbnail or title to edit
- Click comments count to view video comments
- Checkbox for bulk selection (when available)
- Visibility indicator with edit option

### Sorting and Filtering
- Click column headers to sort (Date, Views)
- Filter textbox to search content
- Rows per page dropdown
- Pagination controls (first, previous, next, last)

## Notable Observations

### Design Patterns
- Clean table-based layout with clear visual hierarchy
- Consistent iconography across tabs
- Responsive design with proper spacing
- Empty states with helpful CTAs for tabs without content

### Technical Details
- Uses filter and sort parameters in URL for state management
- Dynamic content loading based on active tab
- Accessibility features with proper ARIA labels
- Real-time updates for view counts and metrics

### User Experience
- Intuitive tab switching for different content types
- Clear visual indicators for visibility status
- Quick access to edit functionality
- Efficient bulk operations interface

## Artifacts
- Screenshot: `.spec/info/screenshots/content-videos-tab.png`
- Snapshot: `.spec/info/snapshots/content-videos-tab.md`
- Additional tab screenshots: All 8 tabs captured with unique screenshots
