# Settings Page

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/settings
**Depth**: 1

## Overview

The Settings page in YouTube Studio is implemented as a modal dialog accessible from the sidebar. It provides comprehensive channel-level configuration options organized into six main categories with multiple sub-sections. This is the central hub for managing all channel settings, permissions, and moderation preferences.

## Main Components

### Settings Dialog Modal
- **Modal container**: Centered overlay dialog with proper z-index
- **Left sidebar navigation**: Six main category tabs
- **Main content area**: Dynamic content based on selected tab
- **Action buttons**: Cancel and Save buttons at bottom right

### Six Main Tabs

1. **General**: Basic display and currency preferences
2. **Channel**: Channel identity, advanced settings, and feature eligibility
3. **Upload Defaults**: Default settings for new video uploads
4. **Permissions**: Channel access and user management
5. **Community Moderation**: Comment and community management
6. **Agreements**: Terms of service and legal agreements

## Functionality

### General Tab
- **Default units**: Currency selection dropdown
  - Affects display currency in YouTube Studio
  - Does not change Google AdSense payout currency
  - Currently set to USD - US Dollar

### Channel Tab - Basic Info
- **Country of residence**: Dropdown with comprehensive country list
  - Used for legal and feature eligibility purposes
  - Currently set to United States
- **Keywords**: Text input for channel keywords
  - Comma-separated values
  - Helps with channel discoverability

### Channel Tab - Advanced Settings
Comprehensive configuration options:

#### Audience Section
- **Made for kids setting**: Three radio buttons
  - Yes: Set channel as made for kids (disables personalized ads, comments, notifications)
  - No: Set channel as not made for kids
  - Review per video: Set setting individually for each video (default)
- COPPA compliance notice and "What's content made for kids?" link

#### Google Ads Account Linking
- Link account button for Google Ads integration
- Enables ads based on video interactions
- Access to channel video insights

#### Automatic Captions
- Checkbox: Don't show potentially inappropriate words
- Prevents potentially inappropriate words in auto-captions
- Learn more link provided

#### Automatic Dubbing
- Early access feature for automatic dubbing
- Enable button to activate on next upload
- Learn more about dubbing link

#### Advertisements
- Checkbox: Disable interest-based ads
- Warning about potential revenue reduction
- Affects remarketing and earned action reports

#### Clips
- Checkbox: Allow viewers to clip my content (checked by default)
- Allows 5-60 second clips to be shared
- Disabling removes existing clips

#### Video Quality Enhancements
- Checkbox: Let YouTube enhance visual quality (checked by default)
- Checkbox: Let YouTube enhance audio quality (checked by default)
- Learn more about enhancements link

#### Third-Party Training
- Checkbox: Allow third-party companies to train AI models using channel content
- Affects content sharing with third parties
- Publicly accessible permission status
- Learn more link

#### Other Settings
- Manage YouTube account link
- Remove YouTube content link

### Channel Tab - Feature Eligibility
Three-tier feature access system:

1. **Standard Features** (Enabled)
   - Upload videos
   - Create playlists
   - Add collaborators and videos to playlists

2. **Intermediate Features** (Eligible)
   - Videos over 15 minutes
   - Custom thumbnails
   - Live streaming

3. **Advanced Features** (Eligible)
   - Increased daily uploads and live streams
   - Eligibility to apply for monetization

Each tier has expand/collapse buttons for details.

### Upload Defaults Tab - Basic Info
Default metadata for new uploads:

- **Title**: Text input with placeholder "Add a title that describes your video"
- **Description**: Text input with placeholder "Tell viewers about your video"
- **Visibility**: Dropdown (Public, Private, Unlisted, Schedule)
- **Tags**: Text input with "Add tag" placeholder

### Upload Defaults Tab - Advanced Settings
Advanced upload defaults:

#### Automatic Chapters
- Checkbox: Allow automatic chapters and key moments (checked by default)
- Can be overridden per video
- Learn more link

#### License and Category
- **License**: Dropdown (Standard YouTube License, Creative Commons)
- **Category**: Dropdown with content categories (Film, Music, Education, etc.)

#### Language and Captions
- **Video language**: Dropdown (English, etc.)
- **Caption certification**: Dropdown for FCC compliance
- **Title and description language**: Dropdown

#### Comments
- **Comments**: On/Off dropdown (default: On)
- **Moderation**: Basic/None dropdown (default: Basic)
- **Show how many viewers like this video**: Checkbox (checked by default)

Note: These settings apply to new videos and posts only, not existing content.

### Permissions Tab
Channel access management:

- **Permissions for [Channel Name]** heading
- **Invite button**: Add new users with permissions
- Explanatory text about permissions
- Table with Name and Role columns
- Currently shows: Tony zhou (723480971@qq.com) - Owner

### Community Moderation Tab - Content Controls
Community and comment management:

#### Comments on New Videos and Posts
- **Comments**: On/Off dropdown (default: On)
- **Moderation**: Basic dropdown
- Note: Applies to new content only

#### Messages in Live Chat
- **Moderation**: None/Basic dropdown (default: None)

#### Posts in Your Community
- **Viewer posts**: On/Off dropdown (default: Off)
- **Moderation**: Basic dropdown
- **Who can post**: All viewers/Subscribers dropdown (default: Subscribers)
- **Minimum subscription time**: 1 day/1 week/1 month dropdown (default: 1 day)
- Note: Applies to new posts only

#### Blocked Words
- Text input: Add blocked words
- Separate words and phrases by commas
- Holds comments/posts with blocked words
- Blocks in live chat

#### Link Text
- Checkbox: Hold comments with hashtags and URLs for review
- Does not apply to moderators or approved users
- URLs and hashtags already blocked in live chat

### Community Moderation Tab - User Management
User role management:

#### Managing Moderators
- Text input: Add managing moderator
- Can manage blocked words and chat modes
- Paste channel URL to add

#### Standard Moderators
- Text input: Add standard moderator
- Can remove comments, manage held content, moderate live chat
- Paste channel URL to add

#### Approved Users
- Text input: Add approved user
- Auto-publishes comments and posts
- Bypasses filtered content checks
- Can send live chat messages in participant mode
- Paste channel URL to add

#### Hidden Users
- Text input: Add hidden user
- Comments/posts don't appear on channel
- Cannot create clips
- Takes several days to remove existing content
- Paste channel URL to add

#### Live Redirect Users
- **All channels can redirect**: Checkbox
- **Channels I subscribe to can redirect**: Checkbox (checked, disabled if subscriptions private)
- Note about private subscriptions
- Link to change privacy setting
- Text input: Add specific channels for live redirect
- Allows creators to send viewers to your live streams/Premieres

### Community Moderation Tab - Channel Guidelines
- **Set guidelines for your channel** heading
- Explanatory text about benefits of guidelines
- **Verify button**: Channel verification required to add guidelines
- Learn more link to guidelines documentation

### Agreements Tab
- **All use of the service is subject to the YouTube Terms of Service** text
- **Learn more** link to terms documentation
- Minimal interface, primarily informational

## Interactive Elements

### Navigation
- **Six main category tabs**: Left sidebar navigation
- **Sub-tabs**: Channel (Basic Info, Advanced Settings, Feature Eligibility), Upload Defaults (Basic Info, Advanced Settings), Community Moderation (Content Controls, User Management, Channel Guidelines)
- **Tab switching**: Click to navigate between sections
- **Active state**: Current tab is highlighted

### Dropdowns
- **Country of residence**: Comprehensive country list (100+ countries)
- **Currency**: Multiple currency options
- **License**: Standard YouTube License, Creative Commons
- **Category**: Content categories
- **Video language**: Language options
- **Comments/Moderation**: On/Off, Basic/None options
- All dropdowns have:
  - Clear labels and help text
  - Expand/collapse functionality
  - Visual feedback on selection
  - Escape/click-outside to close

### Checkboxes
- Various toggles for features (clips, quality enhancements, AI training, etc.)
- Visual checked/unchecked states
- Immediate visual feedback
- Associated help text and links

### Radio Buttons
- Made for kids setting (3 options)
- Only one can be selected
- Clear selection state

### Text Inputs
- Keywords (comma-separated)
- Title and description placeholders
- Blocked words
- All inputs have placeholder text
- Help text where appropriate

### Action Buttons
- **Save button**: Disabled until changes are made, then enabled
- **Cancel button**: Always enabled, shows "Discard changes?" confirmation
- **Invite button** (Permissions): Add users
- **Verify button** (Channel Guidelines): Verify channel
- **Link account button** (Google Ads): Link accounts
- **Enable button** (Automatic dubbing): Enable feature

### Links
- Multiple "Learn more" links throughout
- External documentation links
- "See all changes" links
- Privacy policy links
- All links open in new tab/window

## Notable Observations

1. **Modal Implementation**: Settings is not a separate page but a modal dialog overlaying the current page
2. **Tab Hierarchy**: Two-level navigation (main tabs > sub-tabs)
3. **Scoped Settings**: Many settings apply to new content only, not existing
4. **COPPA Compliance**: Strong emphasis on made-for-kids designation
5. **Granular Permissions**: Multiple user roles (Owner, Managing Moderator, Standard Moderator, Approved User)
6. **Moderation Options**: Comprehensive comment and community moderation tools
7. **Feature Tiers**: Progressive feature unlocking system (Standard > Intermediate > Advanced)
8. **AI Training**: Explicit opt-in for third-party AI training
9. **Quality Enhancements**: Opt-out system for video/audio enhancements
10. **Live Redirect**: Special permissions for live stream redirects
11. **Warnings and Explanations**: Extensive help text throughout
12. **Save Behavior**: Save button only enables when changes detected
13. **Cancel Confirmation**: Prevents accidental loss of changes

## Technical Details

### Layout Structure
- Modal dialog with backdrop
- Left sidebar: 200-250px width
- Main content: Flexible width
- Action bar: Fixed at bottom
- Responsive design adapts to viewport

### State Management
- Save button state tracks changes
- Cancel triggers confirmation dialog
- Each tab maintains independent state
- Sub-tab selection persists within main tab

### Accessibility
- Proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation support (Escape to close dropdowns)
- Clear focus states
- Readable contrast ratios

### Data Flow
- Changes tracked per tab
- Save commits all changes
- Cancel discards unsaved changes with confirmation
- No auto-save, explicit save required

## Artifacts

### Screenshots
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-general-tab.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-channel-basic-info.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-channel-advanced.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-channel-feature-eligibility.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-upload-defaults-basic.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-upload-defaults-advanced.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-permissions.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-community-moderation-content-controls.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-community-moderation-user-management.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-community-moderation-channel-guidelines.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-agreements.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-country-dropdown.png
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\settings\settings-error.png (initial navigation error)

### Snapshots
- C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\snapshots\settings\settings-general-tab.md

### Test Cases Added
- 27 new test cases added to feature_list.json (IDs 176-202)
- Cover all tabs, sub-tabs, dropdowns, checkboxes, and interactive elements
- Include both functional and style categories
- Test navigation, state management, and user interactions
