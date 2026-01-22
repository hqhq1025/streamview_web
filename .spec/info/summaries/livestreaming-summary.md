# Live Streaming Page

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/livestreaming
**Depth**: 2

## Overview
The Live Streaming page is the central hub for managing live streaming functionality on YouTube Studio. This page provides access to stream creation, webcam streaming, stream management, and channel-level streaming settings. Note that this page displays a "Request access to streaming" dialog when live streaming features are not enabled for the channel.

## Main Components

### Navigation Tabs (Top)
- **Stream** (disabled when access not granted): Main tab for creating and managing live streams using encoders
- **Webcam** (disabled when access not granted): Tab for quick webcam-based live streaming
- **Manage** (disabled when access not granted): Tab for managing existing and scheduled live streams

### Secondary Actions (Right side)
- **Channel Level Settings**: Opens settings dialog for overlay configurations during ad breaks
- **Send feedback**: Opens feedback dialog for reporting issues or suggestions

### Main Content Area
- **Request Access Dialog**: Displayed when live streaming access is not enabled
  - Icon and heading: "Request access to streaming"
  - Informational text: "Once requested, it may take up to 24 hours to get access to live streaming"
  - **Request** button: Initiates the access request process

## Functionality

### Access Request Flow
When live streaming is not enabled:
1. User navigates to livestreaming page
2. Request access dialog is displayed automatically
3. User can click "Request" button to request live streaming access
4. YouTube may take up to 24 hours to grant access

### Channel Level Settings
The Channel Level Settings dialog provides:
- **Overlay for breaks** configuration
- Two overlay options:
  - **Use default overlay**: Provides a countdown timer during ad breaks
  - **Choose from your videos**: Select a custom video from the channel's uploads
- Description: "This overlay will need to be integrated to your third-party encoder to work. The overlay will appear when ads aren't available."
- **Learn more** link: Redirects to YouTube support documentation (https://support.google.com/youtube/answer/7385599)
- **Save** button: Initially disabled, becomes enabled when changes are made
- **Cancel** button: Discards changes and closes dialog

### Interactive Elements

#### Buttons
- **Stream tab button** (disabled): Navigation to stream creation interface
- **Webcam tab button** (disabled): Navigation to webcam streaming interface
- **Manage tab button** (disabled): Navigation to stream management interface
- **Channel Level Settings** button: Opens overlay settings dialog
- **Send feedback** button: Opens feedback form in iframe
- **Request** button: Submits live streaming access request
- **Collapse menu** button: Collapses the left sidebar navigation

#### Links
- **YouTube Studio dashboard**: Returns to main Studio dashboard (/channel/UCtxQrYzeMBCKMAofCgcY5dA)
- **Learn more** (in settings dialog): Opens YouTube support documentation

#### Hover States
- Hovering over disabled tabs shows tooltip: "You don't have access to this feature"

## Dialogs and Modals

### Request Access Dialog
- Automatically appears on page load when access not granted
- Contains icon, heading, description, and Request button
- Cannot be dismissed, must request access to proceed

### Settings Dialog (Channel Level Settings)
- Triggered by clicking "Channel Level Settings" button
- Contains overlay configuration options
- Has Cancel confirmation when changes are made
- Shows error: "Discard changes?" when attempting to close with unsaved changes

### Feedback Dialog
- Triggered by clicking "Send feedback" button
- Opens in iframe using UserVoice feedback system
- Can be dismissed with Escape key

## Notable Observations

### Access Control
- Live streaming appears to be a feature that requires channel verification or activation
- All main functionality tabs (Stream, Webcam, Manage) are disabled until access is granted
- This is different from other YouTube Studio pages which are immediately accessible

### Overlay Feature
- The Channel Level Settings specifically focus on "Overlay for breaks"
- This is designed for channels that run mid-roll ads during live streams
- The overlay appears when ads are not available, keeping viewers engaged
- Requires integration with third-party encoders (not for webcam streaming)

### Technical Details
- Console errors appeared when clicking Channel Level Settings:
  - `TypeError: f._onCaptureClick is not a function`
  - Multiple `requestStorageAccessFor: Permission denied` errors
- These errors appear to be non-critical as functionality still works

### User Experience
- Clean, minimal interface when access not granted
- Clear call-to-action (Request button)
- Helpful informational text about the 24-hour waiting period
- Settings dialog provides good explanation of overlay feature

## Artifacts
- Screenshot: `screenshots/livestreaming-page.png`
- Screenshot: `screenshots/livestreaming-settings-dialog.png`
- Screenshot: `screenshots/livestreaming-request-access.png`
- Screenshot: `screenshots/livestreaming-feedback-dialog.png`
- Snapshot: `snapshots/livestreaming-page.md`

## Discovered URLs
No new same-domain URLs were discovered on this page. All navigation either leads to:
- YouTube Studio dashboard (already in explore list)
- External YouTube support documentation
- Feedback iframe (external service)
