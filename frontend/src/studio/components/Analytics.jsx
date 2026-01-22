import React, { useMemo, useState } from 'react';
import { getVideoId, getVideoLikes, getVideoUploadDate, getVideoViews, parseDurationToSeconds } from '../utils/metrics';

const buildTrend = (total, points = 14) => {
  if (!Number.isFinite(total) || total <= 0) {
    return Array(points).fill(0);
  }
  const step = total / points;
  return Array.from({ length: points }, (_, idx) => Math.max(1, Math.round(step * (idx + 1))));
};

export default function Analytics({ videos = [], channel, onSelectVideo, onNotImplemented }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [selectedPeriod, setSelectedPeriod] = useState('last28days');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);

  const totalViews = useMemo(
    () => videos.reduce((sum, video) => sum + getVideoViews(video), 0),
    [videos]
  );

  const watchTimeHours = useMemo(() => {
    const totalSeconds = videos.reduce((sum, video) => {
      const durationSeconds = parseDurationToSeconds(video?.duration);
      return sum + getVideoViews(video) * durationSeconds;
    }, 0);
    return totalSeconds > 0 ? totalSeconds / 3600 : 0;
  }, [videos]);

  const subscriberCount = channel?.subscriberCount || 0;

  const analyticsData = useMemo(() => ({
    views: { value: totalViews, change: 0, chartData: buildTrend(totalViews) },
    watchTime: { value: watchTimeHours, change: 0, chartData: buildTrend(Math.round(watchTimeHours)) },
    subscribers: { value: subscriberCount, change: 0, chartData: buildTrend(subscriberCount) }
  }), [totalViews, watchTimeHours, subscriberCount]);

  const periodOptions = [
    { id: 'last7days', label: 'Last 7 days', dateRange: 'Last 7 days' },
    { id: 'last28days', label: 'Last 28 days', dateRange: 'Last 28 days' },
    { id: 'last90days', label: 'Last 90 days', dateRange: 'Last 90 days' },
    { id: 'last365days', label: 'Last 365 days', dateRange: 'Last 365 days' },
    { id: 'lifetime', label: 'Lifetime', dateRange: 'All time' },
    { id: 'custom', label: 'Custom', dateRange: 'Select dates' }
  ];

  const metricOptions = [
    { id: 'views', label: 'Views' },
    { id: 'watchTime', label: 'Watch time (hours)' },
    { id: 'subscribers', label: 'Subscribers' }
  ];

  const currentPeriod = periodOptions.find(p => p.id === selectedPeriod) || periodOptions[1];
  const currentMetricData = analyticsData[selectedMetric];
  const currentMetricLabel = metricOptions.find(m => m.id === selectedMetric)?.label || 'Views';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'audience', label: 'Audience' },
    { id: 'trends', label: 'Trends' }
  ];

  const sortedByViews = useMemo(() => [...videos].sort((a, b) => getVideoViews(b) - getVideoViews(a)), [videos]);
  const latestVideo = useMemo(() => {
    return [...videos].sort((a, b) => {
      const aDate = new Date(getVideoUploadDate(a) || 0).getTime();
      const bDate = new Date(getVideoUploadDate(b) || 0).getTime();
      return bDate - aDate;
    })[0];
  }, [videos]);

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="relative">
              <button
                onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
                className="flex items-center gap-2 text-[#606060] hover:text-[#0d0d0d] text-sm"
              >
                {currentMetricLabel}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {isMetricDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMetricDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] rounded shadow-lg z-50 w-56 py-2">
                    {metricOptions.map(metric => (
                      <button
                        key={metric.id}
                        onClick={() => {
                          setSelectedMetric(metric.id);
                          setIsMetricDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
                      >
                        {metric.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0d0d0d]">
                {currentMetricData.value.toLocaleString()}
              </span>
              <span className="text-sm text-[#606060] flex items-center">
                {currentMetricData.change}%
              </span>
            </div>
          </div>
          <button
            className="text-[#065fd4] text-sm hover:text-[#0553c2]"
            onClick={() => handleNotImplemented('Analytics details')}
          >
            See more
          </button>
        </div>

        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={currentMetricData.chartData.map((val, idx) => {
                const x = (idx / (currentMetricData.chartData.length - 1)) * 100;
                const y = 100 - (val / Math.max(...currentMetricData.chartData, 1)) * 80;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#065fd4"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-sm"
            />
            {currentMetricData.chartData.map((val, idx) => {
              const x = (idx / (currentMetricData.chartData.length - 1)) * 100;
              const y = 100 - (val / Math.max(...currentMetricData.chartData, 1)) * 80;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="1"
                  fill="#065fd4"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
          <div className="flex justify-between mt-2 text-xs text-[#606060]">
            <span>Start</span>
            <span>Mid</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-[#0d0d0d]">Realtime</h3>
            <p className="text-sm text-[#606060] mt-1">Updating live</p>
          </div>
          <button
            className="text-[#065fd4] text-sm hover:text-[#0553c2]"
            onClick={() => handleNotImplemented('Realtime analytics')}
          >
            See more
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#606060] mb-1">Subscribers</p>
            <p className="text-2xl font-bold text-[#0d0d0d]">{subscriberCount.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-[#606060] mb-1">Views - Last 48 hours</p>
            <p className="text-2xl font-bold text-[#0d0d0d]">{Math.round(totalViews * 0.1).toLocaleString()}</p>
          </div>

          <div className="h-32 bg-[#f9f9f9] rounded flex items-end p-4 gap-2">
            {buildTrend(totalViews, 16).map((height, idx) => (
              <div
                key={idx}
                className="flex-1 bg-[#065fd4] rounded-t"
                style={{ height: `${Math.min(100, height)}%` }}
              />
            ))}
          </div>

          <button
            className="text-[#065fd4] text-sm hover:underline"
            onClick={() => handleNotImplemented('Live subscriber count')}
          >
            See live count
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
          <h4 className="text-sm font-medium text-[#0d0d0d] mb-3">Top content</h4>
          <p className="text-xs text-[#606060] mb-3">Views</p>

          {sortedByViews.slice(0, 1).map(video => (
            <div key={getVideoId(video)} className="flex gap-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <button
                  className="text-sm text-[#065fd4] hover:underline text-left"
                  onClick={() => onSelectVideo?.(getVideoId(video), 'analytics')}
                >
                  {video.title}
                </button>
                <p className="text-sm text-[#0d0d0d] mt-1">{getVideoViews(video).toLocaleString()} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Latest content</h3>

        {latestVideo ? (
          <div>
            <div className="flex gap-4 mb-4">
              <img
                src={latestVideo.thumbnail}
                alt={latestVideo.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#0d0d0d] mb-1">{latestVideo.title}</h4>
                <p className="text-xs text-[#606060]">First 2 hours 47 minutes</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 border border-[#e5e5e5] rounded text-sm text-[#0d0d0d] hover:bg-[#f9f9f9]">
                Views: {getVideoViews(latestVideo).toLocaleString()}
              </button>
              <button className="px-4 py-2 border border-[#e5e5e5] rounded text-sm text-[#0d0d0d] hover:bg-[#f9f9f9]">
                Impressions click-through rate: {Math.min(100, Math.round((getVideoLikes(latestVideo) / Math.max(1, getVideoViews(latestVideo))) * 100))}%
              </button>
              <button className="px-4 py-2 border border-[#e5e5e5] rounded text-sm text-[#0d0d0d] hover:bg-[#f9f9f9]">
                Average view duration: {latestVideo.duration || '0:00'}
              </button>
            </div>

            <button
              className="text-[#065fd4] text-sm hover:underline"
              onClick={() => onSelectVideo?.(getVideoId(latestVideo), 'analytics')}
            >
              See video analytics
            </button>
          </div>
        ) : (
          <div className="text-sm text-[#606060]">No videos yet.</div>
        )}
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">How viewers find your videos</h3>
        <p className="text-sm text-[#606060] mb-4">Views - Last 28 days</p>

        <div className="space-y-2 mb-4">
          {['Overall', 'External', 'StreamView search', 'Suggested videos', 'Playlists'].map((label) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="traffic-source" className="w-4 h-4" defaultChecked={label === 'Overall'} />
              <span className="text-sm text-[#0d0d0d]">{label}</span>
            </label>
          ))}
        </div>

        <button
          className="text-[#065fd4] text-sm hover:underline"
          onClick={() => handleNotImplemented('Traffic sources')}
        >
          See more
        </button>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Impressions and how they led to watch time</h3>
        <p className="text-sm text-[#606060] mb-4">{currentPeriod.dateRange}</p>
        <div className="h-48 bg-[#f9f9f9] rounded flex items-center justify-center">
          <p className="text-sm text-[#606060]">Not enough traffic data</p>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#0d0d0d]">Top videos</h3>
          <button
            className="text-[#065fd4] text-sm hover:underline"
            onClick={() => handleNotImplemented('Top videos details')}
          >
            See more
          </button>
        </div>
        <p className="text-sm text-[#606060] mb-4">Views - Last 28 days</p>

        <div className="space-y-3">
          {sortedByViews.slice(0, 3).map(video => (
            <div key={getVideoId(video)} className="flex gap-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <button
                  className="text-sm text-[#065fd4] hover:underline text-left"
                  onClick={() => onSelectVideo?.(getVideoId(video), 'analytics')}
                >
                  {video.title}
                </button>
                <p className="text-sm text-[#0d0d0d] mt-1">{getVideoViews(video).toLocaleString()} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Top Remixed</h3>
        <p className="text-sm text-[#606060] mb-4">Your content used to create Shorts - Last 28 days</p>
        <div className="h-32 bg-[#f9f9f9] rounded flex items-center justify-center">
          <p className="text-sm text-[#606060]">No data available</p>
        </div>
      </div>
    </div>
  );

  const renderAudienceTab = () => (
    <div className="space-y-6">
      {[
        { title: 'Audience by watch behavior', subtitle: 'Monthly audience' },
        { title: 'When your viewers are on StreamView', subtitle: 'Times shown for Pacific Time' },
        { title: 'Age and gender', subtitle: 'Views - Last 28 days' },
      ].map((section) => (
        <div key={section.title} className="bg-white border border-[#e5e5e5] rounded-md p-6">
          <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">{section.title}</h3>
          <p className="text-sm text-[#606060] mb-4">{section.subtitle}</p>
          <div className="h-48 bg-[#f9f9f9] rounded flex items-center justify-center">
            <p className="text-sm text-[#606060]">Not enough viewer data</p>
          </div>
        </div>
      ))}

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Device type</h3>
        <p className="text-sm text-[#606060] mb-4">Watch time (hours) - Last 28 days</p>
        <div className="space-y-3">
          {['Desktop', 'Mobile', 'Tablet', 'TV', 'Other'].map(device => (
            <div key={device} className="flex items-center justify-between">
              <span className="text-sm text-[#0d0d0d]">{device}</span>
              <span className="text-sm text-[#606060]">-</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Top geographies</h3>
        <p className="text-sm text-[#606060] mb-4">Views - Last 28 days</p>
        <div className="h-32 bg-[#f9f9f9] rounded flex items-center justify-center">
          <p className="text-sm text-[#606060]">Not enough viewer data</p>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Top subtitle/CC languages</h3>
        <p className="text-sm text-[#606060] mb-4">Views - Last 28 days</p>
        <div className="h-32 bg-[#f9f9f9] rounded flex items-center justify-center">
          <p className="text-sm text-[#606060]">Not enough viewer data</p>
        </div>
      </div>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium text-[#0d0d0d]">Get ideas for your next video</h2>
          <button
            className="px-4 py-2 border border-[#e5e5e5] rounded text-sm text-[#0d0d0d] hover:bg-[#f9f9f9]"
            onClick={() => handleNotImplemented('Saved ideas')}
          >
            Saved (0)
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a topic"
            className="w-full px-4 py-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#065fd4]"
          />
        </div>

        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Ideas to get started</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            'Tech Reviews',
            'Cooking Tutorials',
            'Travel Vlogs',
            'Gaming Tips',
            'Fitness Routines',
            'DIY Projects'
          ].map(topic => (
            <button
              key={topic}
              className="border border-[#e5e5e5] rounded p-4 hover:bg-[#f9f9f9] text-left"
              onClick={() => handleNotImplemented('Trend exploration')}
            >
              <div className="w-full h-24 bg-[#f2f2f2] rounded mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#606060]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#0d0d0d]">{topic}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#0d0d0d]">Channel analytics</h1>
          <button
            className="text-[#065fd4] text-sm hover:underline"
            onClick={() => handleNotImplemented('Advanced analytics')}
          >
            Advanced mode
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[#e5e5e5]">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#065fd4] text-[#065fd4]'
                    : 'border-transparent text-[#606060] hover:text-[#0d0d0d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative mb-[-2px]">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] rounded text-sm text-[#0d0d0d] hover:bg-[#f9f9f9]"
            >
              {currentPeriod.dateRange} {currentPeriod.label}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {isPeriodDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsPeriodDropdownOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border border-[#e5e5e5] rounded shadow-lg z-50 w-64 py-2">
                  {periodOptions.map(period => (
                    <button
                      key={period.id}
                      onClick={() => {
                        setSelectedPeriod(period.id);
                        setIsPeriodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm ${
                        selectedPeriod === period.id ? 'bg-[#f0f7ff] text-[#065fd4]' : 'text-[#0d0d0d]'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'content' && renderContentTab()}
      {activeTab === 'audience' && renderAudienceTab()}
      {activeTab === 'trends' && renderTrendsTab()}
    </div>
  );
}
