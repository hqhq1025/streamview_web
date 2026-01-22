# Customization Page

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/customization
**Redirected to**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/editing/profile
**Depth**: 1

## Overview
The Customization page allows channel owners to manage their channel branding, layout, and basic information. The page is divided into two main tabs: Profile and Home tab. This is where creators can customize their channel's appearance, organize their homepage layout, and manage channel metadata.

## Main Components

### Profile Tab
The Profile tab manages channel identity and branding elements:

- **Banner Image**: Channel banner displayed across the top of the channel
  - Recommended size: 2048 x 1152 pixels
  - Maximum size: 6MB
  - Upload button available

- **Profile Picture**: Channel avatar displayed next to videos and comments
  - Recommended size: 98 x 98 pixels minimum
  - Maximum size: 4MB
  - Supported formats: PNG, GIF (no animations)
  - Upload button available

- **Name**: Channel name field
  - Editable textbox
  - Can be changed twice in 14 days
  - Changes visible only on YouTube

- **Handle**: Unique channel identifier (@username)
  - Editable textbox with @ prefix
  - Displays handle URL preview
  - Can be changed twice every 14 days
  - Can be reverted within 14 days

- **Pronouns**: Optional pronoun display
  - "Add pronoun" button opens selection interface
  - Filter by language option
  - Visibility settings (e.g., "Visible to only my subscribers")
  - Text search for finding pronouns
  - Can be edited or removed anytime

- **Description**: Channel about text
  - Large textarea for channel description
  - Appears in About section and search results
  - "Add language" button for translations

- **Channel URL**: Standard channel web address
  - Read-only textbox with channel URL
  - Copy button available
  - Displays unique channel ID

- **Links**: External links section
  - "Add link" button opens link form
  - Fields: Link title (required), URL (required)
  - Remove button for each link
  - Links visible on channel profile and about page

- **Contact Info**: Business contact email
  - Email address field
  - May appear in About section

- **Video Watermark**: Branding overlay on videos
  - Appears in right-hand corner of video player
  - Recommended size: 150 x 150 pixels
  - Maximum size: 1MB
  - Supported formats: PNG, GIF (no animations), BMP, JPEG
  - Upload button available

### Home Tab
The Home tab manages the channel homepage layout:

- **Home Tab Toggle**: Enable/disable home tab customization
  - Switch to show/hide home tab
  - When enabled, activates layout customization options
  - "Publish" button becomes active

- **Layout Section**: Channel homepage layout management
  - Customize layout with up to 12 sections
  - "Add section" button to add new sections

- **Available Sections** (via Add Section menu):
  - Channel trailer
  - Spotlight (for returning subscribers)
  - For You (already added)
  - Videos (already added)
  - Popular videos
  - Short videos
  - Collaborations
  - Live now
  - Past live streams (already added)
  - Upcoming live streams
  - Single playlist
  - Created playlists (already added)
  - Multiple playlists
  - Subscriptions
  - Featured channels
  - Top community clips
  - Posts

- **Section Management**:
  - Each section has an options button (three dots)
  - "Remove section" option available
  - Sections display content counts (e.g., "Videos (1)", "Created playlists (1)")
  - Empty sections show placeholder text

## Functionality

### Profile Tab Features
- Upload banner image
- Upload profile picture
- Edit channel name and handle
- Add and manage pronouns
- Write channel description
- Add translated descriptions
- Copy channel URL
- Add external links
- Set contact email
- Upload video watermark

### Home Tab Features
- Enable/disable home tab
- Add up to 12 sections
- Remove sections
- Customize layout order
- Preview channel layout
- Publish changes

## Interactive Elements

### Buttons
- **View channel**: Opens channel page
- **Cancel**: Reverts unsaved changes (disabled when no changes)
- **Publish**: Saves and publishes changes (disabled when home tab disabled)
- **Upload**: Opens file picker for images
- **Add pronoun**: Opens pronoun selection dialog
- **Add language**: Adds translation for description
- **Copy**: Copies channel URL to clipboard
- **Add link**: Opens link addition form
- **Add section**: Opens section selection menu

### Forms and Inputs
- Channel name textbox
- Handle textbox
- Pronoun search textbox
- Description textarea
- Email address textbox
- Link title textbox
- Link URL textbox

### Toggles and Switches
- Home tab enable/disable switch

### Dropdowns and Menus
- Pronoun language filter dropdown
- Pronoun visibility dropdown
- Section options menu (Remove section)
- Add section menu (16 section types)

## Notable Observations

1. **Tab Navigation**: The page uses tabs to separate Profile and Home tab customization
2. **URL Routing**: Direct navigation to /customization redirects to /editing/profile
3. **Validation**: "Add link" button becomes disabled after clicking until form is filled
4. **Publishing**: Changes can be cancelled or published, similar to a form workflow
5. **Section Limits**: Home tab supports up to 12 sections
6. **Visibility Settings**: Pronouns have visibility controls (e.g., subscribers only)
7. **Format Restrictions**: Image uploads have specific size and format requirements
8. **Change Limits**: Name and handle changes have frequency restrictions (twice in 14 days)
9. **Preview URLs**: Handle changes show real-time URL preview
10. **Empty States**: Sections with no content show descriptive placeholder text

## Technical Details

- **Page State Management**: Uses enable/disable patterns for controls
- **Form Validation**: Real-time validation enables/disables buttons
- **Modal Dialogs**: Options menus appear as modal dialogs
- **Responsive Design**: Image size recommendations mention "all devices"
- **Storage State**: Changes require explicit "Publish" action to save

## Artifacts

- Screenshots:
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-error-state.png (initial error state)
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-profile-tab-full.png
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-home-tab-full.png
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-home-tab-enabled-full.png
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-for-you-options-menu.png
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-add-section-menu.png
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-pronoun-selection.png
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\screenshots\customization\customization-add-link-form.png

- Snapshots:
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\snapshots\customization\customization-profile-tab-snapshot.md
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\snapshots\customization\customization-profile-tab-final-snapshot.md

- Summary:
  - C:\Users\adlsdztony\code\web-v2\youtube_studio_collect\.spec\info\summaries\customization-summary.md
