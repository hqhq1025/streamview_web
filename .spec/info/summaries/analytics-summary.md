# Channel Analytics

**URL**: https://studio.youtube.com/channel/UCtxQrYzeMBCKMAofCgcY5dA/analytics/tab-overview/period-default
**Depth**: 1

## Overview
The Channel Analytics page provides comprehensive performance data for a YouTube channel, including views, watch time, subscribers, and audience insights. It features multiple tabs for different analytics perspectives and various time period options.

## Main Components

### Top Bar
- **Advanced Mode Link**: Direct link to advanced analytics exploration
- **Tab Navigation**: Overview, Content, Audience, Trends tabs
- **Time Period Selector**: Dropdown with preset ranges (7, 28, 90, 365 days, Lifetime, Custom) and year/month options

### Overview Tab
- **Key Metric Card**: Main performance chart with metric selector dropdown
  - Views: Total views for selected date range
  - Watch time (hours): Estimated total viewing hours
  - Subscribers: Net subscriber change
  - Chart with date range visualization
  - "See more" link to detailed analytics
- **Realtime Section**:
  - Live subscriber count (updates in real-time)
  - Views from last 48 hours
  - Live activity chart
  - "See live count" link
- **Top Content**: Shows best-performing videos with view counts
- **Latest Content**: Most recent video with key metrics:
  - Views
  - Impressions click-through rate
  - Average view duration
  - "See video analytics" link

### Content Tab
- **Performance Chart**: Views, Impressions, CTR, or Average view duration
- **Traffic Sources**: How viewers find videos (Overall, External, YouTube search, Suggested videos, Playlists)
- **Impressions Report**: How impressions led to watch time
- **Top Videos List**: Performance ranking of videos
- **Top Remixed**: Content used to create Shorts

### Audience Tab
- **Monthly Audience Chart**: Unique viewers over time
- **Audience Segments**: Viewers by watch behavior (New, Casual, Regular)
- **Viewers Schedule**: When viewers are on YouTube (time-of-day heatmap)
- **Subscriber Watch Time**: Watch time from subscribers vs non-subscribers
- **Demographics**: Age and gender breakdown
- **Content Affinity**: Popular with different audience segments
- **External Insights**:
  - Channels your audience watches
  - What your audience watches
- **Device Types**: Watch time by device (Desktop, Mobile, Tablet, TV, Other)
- **Geographies**: Top countries/regions
- **Subtitle/CC Languages**: Most used caption languages

### Trends Tab
- **Research Tool**: Get ideas for next video
- **Saved Ideas**: Bookmark interesting topics
- **Search**: Search for trending topics
- **Topic Suggestions**: Pre-populated trending topics with:
  - Topic title
  - Thumbnail/image
  - Click to explore detailed analytics

## Functionality

### Time Period Selection
- Preset ranges: 7, 28, 90, 365 days, Lifetime
- Yearly breakdown: 2025, 2024, etc.
- Monthly breakdown: December, November, October, etc.
- Custom date range selection

### Metric Switching
- On Overview tab: Views, Watch time, Subscribers
- On Content tab: Views, Impressions, CTR, Average view duration
- On Audience tab: Monthly audience, Subscribers

### Interactive Charts
- Hover tooltips show detailed values
- Click data points for more information
- Responsive to metric and time period changes

### Navigation
- "See more" links lead to advanced analytics mode
- Video thumbnails link to individual video analytics
- Tab switching preserves current time period selection

## Interactive Elements

### Buttons and Controls
- **Advanced mode**: Opens comprehensive analytics explorer
- **Time period dropdown**: Opens date range selector
- **Metric dropdowns**: Switch between different metrics
- **Tab navigation**: Switch between analytics views
- **"See more" links**: Navigate to detailed analytics
- **"See live count"**: View real-time subscriber analytics
- **"See video analytics"**: Navigate to individual video performance

### Radio Buttons (Content Tab)
- Traffic source filters: Overall, External, YouTube search, Suggested videos, Playlists
- Audience segment filters: New, Casual, Regular

### Links
- Video thumbnails navigate to video analytics
- Topic cards navigate to topic detail pages
- All "See more" links navigate to advanced analytics with relevant filters

## Notable Observations

### Data Availability
- Many reports show "Not enough data" messages for channels with low traffic
- Demographic data requires minimum view thresholds
- Realtime data shows last 48 hours activity
- Latest content metrics become available 3 hours after publish

### URL Structure
- Base: `/analytics/tab-{tab_name}/period-{period}`
- Tab names: overview, content, build_audience, research
- Periods: default (28 days), quarter (90 days), month (30 days), year (365 days), lifetime
- Advanced mode URLs contain detailed query parameters for filters and metrics

### Performance Notes
- Page loads quickly with tab switching
- Charts render smoothly
- Dropdown animations are smooth
- Realtime section updates live without page refresh

### User Experience
- Clean, intuitive interface
- Clear hierarchy of information
- Consistent navigation patterns
- Helpful tooltips explain metrics
- "See more" links provide depth without cluttering main view

## Artifacts
- Screenshots:
  - `.spec/info/screenshots/analytics-overview-tab-full.png`
  - `.spec/info/screenshots/analytics-content-tab-full.png`
  - `.spec/info/screenshots/analytics-audience-tab-full.png`
  - `.spec/info/screenshots/analytics-trends-tab-full.png`
  - `.spec/info/screenshots/analytics-time-period-dropdown.png`
  - `.spec/info/screenshots/analytics-watch-time-metric.png`
- Snapshots:
  - `.spec/info/snapshots/analytics-overview-tab-snapshot.md`
- Summary: `.spec/info/summaries/analytics-summary.md`
