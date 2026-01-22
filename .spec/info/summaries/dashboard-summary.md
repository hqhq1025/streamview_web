# Channel Dashboard

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA
**Depth**: 0

## Overview
The Channel Dashboard is the main landing page in YouTube Studio, providing creators with a comprehensive overview of their channel's performance at a glance. It serves as the central hub for accessing key metrics, recent activity, and quick actions.

## Main Components

### Top Navigation Bar
- **Collapse menu button**: Toggles the sidebar navigation
- **YouTube Studio logo**: Links back to the dashboard
- **Skip navigation**: Accessibility feature for keyboard navigation
- **Search box**: "Search across your channel" - allows searching within the studio
- **Help button**: Opens help resources
- **Notifications button**: Shows channel notifications
- **Create button**: Opens creation menu with options:
  - Upload videos
  - Go live
  - Create post
  - New playlist
  - New podcast
- **Account profile**: Shows current account (Tony zhou)

### Sidebar Navigation
- **Channel info**: Displays channel name and profile picture
- **Main menu items**:
  - Dashboard (current page)
  - Content
  - Analytics
  - Community
  - Subtitles
  - Content detection
  - Earn
  - Customization
  - Audio library
- **Secondary menu items**:
  - Settings
  - Send feedback

### Quick Actions Bar
- **Upload videos button**: Opens video upload dialog
- **Go live button**: Navigates to livestreaming page
- **Create post button**: Opens post creation dialog

### Main Dashboard Content

#### 1. Latest Video Performance Card
- Displays the most recently uploaded video
- Shows video thumbnail and title: "STUDY SCENE4 tilt the black book against the shelf——使用Clipchamp制作"
- **Key metrics shown**:
  - Views: 41
  - Comments: 4
  - Likes: 2
- **Time indicator**: "First 2 hours 31 minutes" (updates in real-time)
- **Expandable metrics** (click to select):
  - Views
  - Impressions click-through rate
  - Average view duration
- **Note**: "Additional metrics become available 3 hours after publish"
- **Action buttons**:
  - "Go to video analytics": Links to video-specific analytics
  - "See comments (4)": Links to video comments
- **Collapse button**: Collapses the card

#### 2. Community Posts Section
- **Call-to-action**: "Create your first post to start a conversation and get feedback from your community"
- **Create post button**: Opens post creation interface

#### 3. Channel Analytics Card
- **Current subscribers**: 0
- **Time period selector**: "Last 28 days"
- **Summary metrics**:
  - Views: 0
  - Watch time (hours): 0.0
  - Each metric shows comparison indicator (—)
- **Top videos section**:
  - Shows "Last 48 hours · Views"
  - Table format with video title and view count
  - Links to video analytics
- **Action button**: "Go to channel analytics"

#### 4. Recent Comments Section
- **Heading**: "Comments"
- **Latest comment display**:
  - User: @XinyuanWang-f6m
  - Time: 2 hours ago
  - Content: "tony zhou无敌"
- **View more button**: Links to full comments inbox

#### 5. Creator Insider Section
- **News card**: "This Week at YouTube"
- **Content**: "Hey Insiders! Our final 2025 Newsflash is here. Thanks for an amazing year of support and feedback. See you in January for more!"
- **Action button**: "Watch on YouTube" (links to https://www.youtube.com/watch?v=362YARqMk84)

#### 6. What's New in Studio Section
- **Feature announcements**:
  1. "Increasing Shorts length" - links to support documentation
  2. "Expansion of channel permissions" - links to support documentation
  3. "Upcoming changes to Community Guidelines warnings" - links to support documentation

### Footer Links
- Terms of use
- Privacy policy
- Policies & Safety

## Functionality

### Interactive Elements
1. **Metric selection**: Click on metric buttons (Views, CTR, Avg view duration) to highlight and view details
2. **Video cards**: Click to navigate to video analytics or comments
3. **Navigation menu**: All sidebar items are clickable and navigate to respective pages
4. **Create menu**: Dropdown with 5 creation options
5. **Search functionality**: Real-time search across channel content
6. **Collapse/expand**: Video performance card can be collapsed

### Dynamic Content
- Real-time updates of video performance metrics
- Time-based indicators (e.g., "First 2 hours 31 minutes")
- Latest comments section updates dynamically
- Channel analytics reflect current performance data

### Responsive Behavior
- Sidebar can be collapsed for more screen space
- Cards are organized in a grid layout
- Metrics adapt based on data availability

## Interactive Elements

### Buttons
- Upload videos (primary action)
- Go live (navigation)
- Create post (navigation)
- Create menu trigger (dropdown)
- Collapse menu (sidebar toggle)
- Metric selection buttons (Views, CTR, Avg view duration)
- Go to video analytics
- See comments
- Go to channel analytics
- View more (comments)
- Watch on YouTube

### Links
- All sidebar navigation items
- Video titles in Top videos table
- Support documentation links
- Footer policy links

### Forms
- Search textbox (live search)

### Dynamic Content
- Video performance metrics (update over time)
- Comments section (real-time updates)
- Channel analytics (period-based data)

## Notable Observations

### Design Patterns
- **Card-based layout**: Information is organized in distinct, collapsible cards
- **Metric-driven dashboard**: Emphasis on key performance indicators (KPIs)
- **Progressive disclosure**: Detailed metrics are revealed on interaction
- **Action-oriented design**: Primary actions are prominently displayed
- **Information hierarchy**: Most important information (latest video) is shown first

### Technical Details
- Uses real-time data updates
- Implements lazy loading for metrics (some available after 3 hours)
- Responsive to channel performance (shows "0" for new channels)
- Integrated with multiple YouTube services (Analytics, Community, Live streaming)

### User Experience Considerations
- **Empty states**: Gracefully handles zero metrics with "—" indicators
- **Onboarding**: Clear CTAs for first-time content creation (posts)
- **Contextual help**: Creator Insider and What's New sections keep users informed
- **Quick actions**: Primary creation actions are always accessible
- **Navigation efficiency**: Sidebar provides persistent access to all sections

### Accessibility Features
- Skip navigation link for keyboard users
- Proper heading structure (h1, h2, h3)
- Semantic HTML elements (nav, main, menu, button, link)
- ARIA roles and accessible names
- Focus management on interactive elements

## Artifacts
- Screenshot: `.spec/info/screenshots/dashboard-full.png`
- Screenshot (metric selected): `.spec/info/screenshots/dashboard-views-metric-selected.png`
- Screenshot (create menu): `.spec/info/screenshots/dashboard-create-menu.png`
- Snapshot: `.spec/info/snapshots/dashboard-snapshot.md`
