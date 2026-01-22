# Content Detection

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/content-detection (redirects to /copyright)
**Depth**: 1
**Page Title**: Content detection - YouTube Studio

## Overview

The Content Detection page (also known as Copyright page) displays copyright-related information for the channel, including copyright claims, removal requests, and likeness detection features. The page URL `/content-detection` redirects to `/copyright`.

## Main Components

- **Sidebar Navigation**: Contains navigation menu with:
  - Dashboard
  - Content
  - Analytics
  - Community
  - Subtitles
  - Content detection (active)
  - Earn
  - Customization
  - Audio library
  - Settings
  - Send feedback

- **Top Bar**: Contains search, help, notifications, create button, and account info

- **Tab Navigation**:
  - Copyright tab (currently only visible tab)
  - Additional tabs may be present but not fully loaded

## Page Sections

### 1. Copyright Tab (Active)
Currently selected tab showing copyright-related content

### 2. Removal Requests Section
- **"New removal request" button**: For submitting copyright takedown requests
- **Empty State Message**: "Nothing to see yet - You haven't submitted any copyright takedown requests"
- **Help Text**: "Looking for a copyright claim somebody made on your video? Check the video list"
- **Links**:
  - Link to copyright takedown requests
  - Link to video list

### 3. Likeness Detection Section
- **Description**: "Review content where your likeness may be altered or made with AI"
- **Note**: "Likeness detection accuracy is constantly improving"

### 4. Error States
Multiple sections on the page display error messages:
- "Oops, something went wrong" with "Retry" buttons
- These appear in multiple locations suggesting content loading issues

## Functionality

- **Tab Navigation**: Switch between different content detection categories (currently only Copyright tab is visible)
- **New Removal Request**: Create new copyright takedown requests
- **Video List Navigation**: Access videos with copyright claims
- **Retry Mechanism**: Retry loading failed content sections

## Interactive Elements

### Buttons
- **New removal request**: Initiates copyright takedown request flow
- **Retry**: Multiple retry buttons for failed content sections
- **Create**: Top bar create button
- **Search**: Search across channel
- **Help**: Access help resources
- **Notifications**: View notifications

### Links
- **Copyright takedown requests**: Navigate to takedown requests
- **Video list**: Check videos with copyright claims
- **Sidebar navigation**: Navigate to other Studio sections

### Navigation
- All major Studio sections accessible via sidebar
- Breadcrumb navigation likely available

## Notable Observations

1. **URL Redirection**: `/content-detection` redirects to `/copyright`
2. **Loading Issues**: Multiple sections show error states with "Oops, something went wrong" messages
3. **Single Tab Visible**: Only Copyright tab is currently visible, though other tabs may exist
4. **Empty States**: Removal requests section shows empty state with helpful messaging
5. **AI Features**: Likeness detection feature for AI-generated/altered content
6. **Custom Elements**: Page uses custom web components (ytcr-management-page, ytcp-*)
7. **Shadow DOM**: Content is rendered within shadow DOM, making some content harder to access

## Technical Details

- **Custom Components**: Uses ytcr-management-page and related Polymer components
- **Tab System**: tp-yt-paper-tabs and tp-yt-paper-tab elements
- **Shadow DOM**: Content rendered within shadow DOM boundaries
- **Dynamic Loading**: Content loads asynchronously, some sections fail to load

## Content Loading Behavior

- Page uses progressive loading
- Some sections fail to load and display error states
- Retry buttons provided for failed sections
- Likeness detection section appears to be a newer feature

## Artifacts

- Screenshot: `screenshots/content-detection/content-detection-final-full.png`
- Screenshot: `screenshots/content-detection/content-detection-loaded-full.png`
- Screenshot: `screenshots/content-detection/content-detection-viewport.png`
- Snapshot: `snapshots/content-detection/content-detection-snapshot.md`
- Error screenshot: `screenshots/content-detection/content-detection-error.png`
