import React, { useMemo, useState } from 'react';
import { Play, Eye, MousePointerClick, Clock } from 'lucide-react';
import {
  buildVideoLookup,
  getVideoId,
  getVideoLikes,
  getVideoUploadDate,
  getVideoViews,
  parseDurationToSeconds,
  flattenComments,
} from '../utils/metrics';

export default function Dashboard({
  videos = [],
  commentsByVideo = {},
  channel,
  onUploadClick,
  onSelectVideo,
  onNavigate,
  onNotImplemented,
  onGoLiveClick,
  onCreatePostClick,
}) {
  const [selectedMetric, setSelectedMetric] = useState('views');

  const sortedByDate = useMemo(() => {
    return [...videos].sort((a, b) => {
      const aDate = new Date(getVideoUploadDate(a) || 0).getTime();
      const bDate = new Date(getVideoUploadDate(b) || 0).getTime();
      return bDate - aDate;
    });
  }, [videos]);

  const latestVideo = sortedByDate[0];
  const latestVideoId = getVideoId(latestVideo);
  const latestViews = getVideoViews(latestVideo);
  const latestLikes = getVideoLikes(latestVideo);
  const latestComments = latestVideoId
    ? (commentsByVideo?.[latestVideoId] || []).length
    : 0;

  const sortedByViews = useMemo(() => {
    return [...videos].sort((a, b) => getVideoViews(b) - getVideoViews(a));
  }, [videos]);

  const ranking = latestVideoId
    ? sortedByViews.findIndex((video) => getVideoId(video) === latestVideoId) + 1
    : 0;

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

  const topVideos = sortedByViews.slice(0, 3);
  const videoLookup = useMemo(() => buildVideoLookup(videos), [videos]);

  const recentComments = useMemo(() => {
    const entries = flattenComments(commentsByVideo);
    return entries
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      .slice(0, 3);
  }, [commentsByVideo]);

  const metrics = [
    {
      id: 'views',
      label: 'Views',
      value: latestViews.toLocaleString(),
      icon: Eye,
      comparison: '—'
    },
    {
      id: 'impressions',
      label: 'Impressions click-through rate',
      value: latestViews ? `${Math.min(100, Math.round((latestLikes / Math.max(1, latestViews)) * 100))}%` : '0%',
      icon: MousePointerClick,
      comparison: '—'
    },
    {
      id: 'duration',
      label: 'Average view duration',
      value: latestVideo?.duration || '0:00',
      icon: Clock,
      comparison: '—'
    },
  ];

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatElapsedTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) {
      return `First ${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `First ${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    }
    if (minutes > 0) {
      return `First ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return 'Just published';
  };

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const handleUploadClick = () => {
    if (typeof onUploadClick === 'function') {
      onUploadClick();
      return;
    }
    handleNotImplemented('Upload videos');
  };

  const handleSelectVideo = (videoId, tab) => {
    if (typeof onSelectVideo === 'function') {
      onSelectVideo(videoId, tab);
      return;
    }
    handleNotImplemented('Open video details');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Channel dashboard</h1>

      {/* Quick Actions Bar */}
      <div className="mb-6 flex gap-4">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-[#065fd4] text-white rounded hover:bg-[#0553c2] font-medium"
          onClick={handleUploadClick}
        >
          <Play size={18} />
          Upload videos
        </button>
        <button
          className="flex items-center gap-2 px-6 py-3 border border-[#d3d3d3] text-[#0d0d0d] rounded hover:bg-[#f2f2f2] font-medium"
          onClick={onGoLiveClick || (() => handleNotImplemented('Go live'))}
        >
          Go live
        </button>
        <button
          className="flex items-center gap-2 px-6 py-3 border border-[#d3d3d3] text-[#0d0d0d] rounded hover:bg-[#f2f2f2] font-medium"
          onClick={onCreatePostClick || (() => handleNotImplemented('Create post'))}
        >
          Create post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Video Performance */}
        <div className="bg-white border border-[#e5e5e5] rounded-md p-5 shadow-sm">
          <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Latest video performance</h2>
          {latestVideo && (
            <p className="text-xs text-[#606060] mb-4">{formatElapsedTime(getVideoUploadDate(latestVideo))}</p>
          )}

          {latestVideo ? (
            <>
              {/* Video thumbnail and title */}
              <div className="mb-4">
                <div className="relative aspect-video bg-[#f2f2f2] mb-3 rounded overflow-hidden">
                  <img
                    src={latestVideo.thumbnail}
                    alt={latestVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium text-[#0d0d0d] mb-2">{latestVideo.title}</h3>
              </div>

              {/* Metrics buttons */}
              <div className="space-y-3 mb-4">
                {metrics.map(metric => {
                  const Icon = metric.icon;
                  return (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id)}
                      className={`w-full text-left px-4 py-4 rounded border transition-colors ${
                        selectedMetric === metric.id
                          ? 'border-[#065fd4] bg-[#f0f7ff]'
                          : 'border-[#e5e5e5] hover:bg-[#f9f9f9]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#606060] mb-1">{metric.label}</div>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon size={16} className="text-[#606060] flex-shrink-0" />}
                            <span className="text-2xl font-bold text-[#0d0d0d]">{metric.value}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#606060] text-sm mt-1">
                          <span>{metric.comparison}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 pt-3 border-t border-[#e5e5e5]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#606060]">Ranking by views</span>
                  <span className="text-[#0d0d0d]">{ranking} of {videos.length || 1}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#606060]">Comments</span>
                  <span className="text-[#0d0d0d]">{latestComments}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#606060]">Likes</span>
                  <span className="text-[#0d0d0d]">{latestLikes}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e5e5e5] space-y-2">
                <button
                  className="text-[#065fd4] text-sm font-medium uppercase hover:text-[#003399]"
                  onClick={() => handleSelectVideo(latestVideoId, 'analytics')}
                >
                  Go to video analytics
                </button>
                <button
                  className="block text-[#065fd4] text-sm font-medium uppercase hover:text-[#003399]"
                  onClick={() => handleSelectVideo(latestVideoId, 'comments')}
                >
                  See comments ({latestComments})
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm text-[#606060]">Upload a video to see performance metrics.</div>
          )}
        </div>

        {/* Channel Analytics */}
        <div className="bg-white border border-[#e5e5e5] rounded-md p-5 shadow-sm">
          <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Channel analytics</h2>
          <div className="mb-6">
            <p className="text-[#606060] text-sm mb-1">Current subscribers</p>
            <p className="text-3xl font-bold text-[#0d0d0d]">{(channel?.subscriberCount || 0).toLocaleString()}</p>
            <p className="text-[#606060] text-xs mt-1">+0 in last 28 days</p>
          </div>
          <div className="space-y-4 border-t border-[#e5e5e5] pt-4">
            <h3 className="text-[#0d0d0d] font-medium text-sm">Summary</h3>
            <p className="text-[#606060] text-xs">Last 28 days</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#606060]">Views</span>
              <span className="text-[#0d0d0d]">{totalViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#606060]">Watch time (hours)</span>
              <span className="text-[#0d0d0d]">{watchTimeHours.toFixed(1)}</span>
            </div>
          </div>

          {/* Top Videos Table */}
          <div className="mt-6 pt-4 border-t border-[#e5e5e5]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[#0d0d0d] font-medium text-sm">Top videos</h3>
              <span className="text-[#606060] text-xs">Last 48 hours · Views</span>
            </div>
            <div className="space-y-3">
              {topVideos.map((video) => (
                <div key={getVideoId(video)} className="flex justify-between items-start text-sm">
                  <button
                    className="text-[#065fd4] hover:underline text-left flex-1"
                    onClick={() => handleSelectVideo(getVideoId(video), 'details')}
                  >
                    {video.title}
                  </button>
                  <span className="text-[#0d0d0d] ml-4">{getVideoViews(video).toLocaleString()}</span>
                </div>
              ))}
              {topVideos.length === 0 && (
                <div className="text-xs text-[#606060]">No videos yet.</div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e5e5e5]">
            <button
              className="text-[#065fd4] text-sm font-medium uppercase hover:text-[#003399]"
              onClick={() => {
                if (typeof onNavigate === 'function') {
                  onNavigate('analytics');
                } else {
                  handleNotImplemented('Channel analytics');
                }
              }}
            >
              Go to channel analytics
            </button>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white border border-[#e5e5e5] rounded-md p-5 shadow-sm">
          <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Comments</h2>
          <div className="space-y-4">
            {recentComments.length > 0 ? (
              recentComments.map((comment) => {
                const videoTitle = videoLookup[comment.videoId]?.title || 'Unknown video';
                return (
                  <div key={comment.commentId} className="flex gap-3">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#0d0d0d]">{comment.userName}</span>
                        <span className="text-xs text-[#606060]">{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-[#0d0d0d] mb-1">{comment.text}</p>
                      <p className="text-xs text-[#606060]">On: {videoTitle}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-[#606060]">No recent comments yet.</div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-[#e5e5e5]">
            <button
              className="text-[#065fd4] text-sm font-medium uppercase hover:text-[#003399]"
              onClick={() => {
                if (typeof onNavigate === 'function') {
                  onNavigate('community');
                } else {
                  handleNotImplemented('Comments');
                }
              }}
            >
              View more
            </button>
          </div>
        </div>
      </div>

      {/* Second row - Full width sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Creator Insider News */}
        <div className="bg-white border border-[#e5e5e5] rounded-md p-5 shadow-sm">
          <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Creator Insider</h2>
          <div className="space-y-4">
            <div className="bg-[#f2f2f2] h-32 rounded flex items-center justify-center text-[#606060]">
              Video Thumbnail
            </div>
            <h3 className="text-[#0d0d0d] font-medium">This Week at StreamView</h3>
            <p className="text-[#606060] text-sm">Stay up to date with the latest news and updates from StreamView.</p>
            <button
              className="text-[#065fd4] text-sm font-medium uppercase hover:text-[#003399]"
              onClick={() => window.open('https://www.youtube.com/creatorinsider', '_blank')}
            >
              Watch on StreamView
            </button>
          </div>
        </div>

        {/* What's New in Studio */}
        <div className="bg-white border border-[#e5e5e5] rounded-md p-5 shadow-sm">
          <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">What's new in Studio</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-[#0d0d0d] font-medium text-sm mb-2">Increasing Shorts length</h3>
              <p className="text-[#606060] text-sm">Shorts can now be up to 3 minutes long.</p>
            </div>
            <div className="border-t border-[#e5e5e5] pt-4">
              <h3 className="text-[#0d0d0d] font-medium text-sm mb-2">Expansion of channel permissions</h3>
              <p className="text-[#606060] text-sm">New permission levels for team collaboration.</p>
            </div>
            <div className="border-t border-[#e5e5e5] pt-4">
              <h3 className="text-[#0d0d0d] font-medium text-sm mb-2">Upcoming changes to Community Guidelines warnings</h3>
              <p className="text-[#606060] text-sm">Learn about updated community guidelines.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Posts CTA */}
      <div className="bg-white border border-[#e5e5e5] rounded-md p-5 shadow-sm mt-6">
        <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Community Posts</h2>
        <p className="text-[#606060] text-sm mb-4">Create your first post to start a conversation and get feedback from your community</p>
        <button
          className="px-6 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0553c2] font-medium"
          onClick={onCreatePostClick || (() => handleNotImplemented('Community posts'))}
        >
          Create post
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[#e5e5e5]">
        <div className="flex flex-wrap gap-6 text-xs text-[#606060]">
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#065fd4]"
          >
            Terms of use
          </a>
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#065fd4]"
          >
            Privacy policy
          </a>
          <a
            href="https://www.youtube.com/howyoutubeworks/policies/community-guidelines/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#065fd4]"
          >
            Policies & Safety
          </a>
        </div>
        <p className="text-xs text-[#909090] mt-4">© 2024 StreamView Studio Clone</p>
      </footer>
    </div>
  );
}
