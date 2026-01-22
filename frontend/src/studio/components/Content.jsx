import React, { useMemo, useState, useEffect } from 'react';
import { getVideoDislikes, getVideoId, getVideoUploadDate, getVideoLikes, getVideoViews } from '../utils/metrics';
import LiveStreaming from './LiveStreaming';

export default function Content({
  videos = [],
  commentsByVideo = {},
  onVideoClick,
  onUploadClick,
  onNotImplemented,
}) {
  const [activeTab, setActiveTab] = useState('videos');
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [openOptionsMenu, setOpenOptionsMenu] = useState(null); // Track which video's options menu is open
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openOptionsMenu !== null) {
        setOpenOptionsMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openOptionsMenu]);

  const tabs = [
    { id: 'videos', label: 'Videos' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'live', label: 'Live' },
    { id: 'posts', label: 'Posts' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'collaborations', label: 'Collaborations' }
  ];

  const allRows = videos;

  const getCommentCount = (video) => {
    const videoId = getVideoId(video);
    if (videoId && Array.isArray(commentsByVideo?.[videoId])) {
      return commentsByVideo[videoId].length;
    }
    if (typeof video.comments === 'number') return video.comments;
    if (typeof video.commentCount === 'number') return video.commentCount;
    return 0;
  };

  const getLikeRatio = (video) => {
    const likeCount = getVideoLikes(video);
    const dislikeCount = getVideoDislikes(video);
    const total = likeCount + dislikeCount;
    if (!total) return '-';
    return `${Math.round((likeCount / total) * 100)}%`;
  };

  // Filter and sort videos
  const rows = useMemo(() => {
    let filtered = allRows;

    // Apply filter
    if (filterText.trim()) {
      const search = filterText.toLowerCase();
      filtered = allRows.filter(video => {
        const title = video.title || video.asset?.original_filename || video.name || '';
        const description = video.description || '';
        return title.toLowerCase().includes(search) || description.toLowerCase().includes(search);
      });
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal;
      let bVal;

      switch (sortColumn) {
        case 'date':
          aVal = new Date(getVideoUploadDate(a) || 0).getTime();
          bVal = new Date(getVideoUploadDate(b) || 0).getTime();
          break;
        case 'views':
          aVal = getVideoViews(a);
          bVal = getVideoViews(b);
          break;
        case 'comments':
          aVal = getCommentCount(a);
          bVal = getCommentCount(b);
          break;
        case 'likes':
          aVal = getVideoLikes(a);
          bVal = getVideoLikes(b);
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    return sorted;
  }, [allRows, filterText, sortColumn, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const handleUploadClick = () => {
    if (typeof onUploadClick === 'function') {
      onUploadClick();
    } else {
      handleNotImplemented('Upload videos');
    }
  };

  const handleViewOnStreamView = (video) => {
    const url = video.watchUrl || video.videoUrl || (getVideoId(video) ? `/watch/${getVideoId(video)}` : null);
    if (!url) {
      handleNotImplemented('View on StreamView');
      return;
    }
    window.open(url, '_blank', 'noopener');
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleOptionsClick = (videoId, event) => {
    event.stopPropagation();
    setOpenOptionsMenu(openOptionsMenu === videoId ? null : videoId);
  };

  const handleDeleteVideo = (videoId) => {
    showToastMessage('Video deleted successfully');
    setOpenOptionsMenu(null);
  };

  const handleDownloadVideo = (videoId) => {
    showToastMessage('Download started');
    setOpenOptionsMenu(null);
  };

  const handleGetShareableLink = (videoId) => {
    showToastMessage('Link copied to clipboard');
    setOpenOptionsMenu(null);
  };

  // Render empty state for non-videos tabs
  const renderEmptyState = (tabId) => {
    const emptyStates = {
      shorts: {
        title: 'Create Shorts to grow your audience',
        description: 'Shorts are short-form videos that are 60 seconds or less. Create engaging content to reach new viewers.',
        buttonText: 'Upload videos',
        icon: 'M10 16.5l6-4.5-6-4.5v9z',
        onClick: handleUploadClick,
      },
      live: {
        title: 'Go live and connect with your audience in real time',
        description: 'Stream live to engage with your audience and build community.',
        buttonText: 'Get started',
        icon: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
        onClick: () => handleNotImplemented('Live streaming'),
      },
      posts: {
        title: 'Share your thoughts with your community',
        description: 'Create posts to engage with your subscribers between video uploads.',
        buttonText: 'Create a post',
        icon: 'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z',
        onClick: () => showToastMessage('Post creation opened - feature coming soon'),
      },
      playlists: {
        title: 'Organize your videos into playlists',
        description: 'Group videos together to help viewers watch more of your content.',
        buttonText: 'New playlist',
        icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z',
        onClick: () => handleNotImplemented('Playlists'),
      },
      podcasts: {
        title: 'Create podcasts to reach new audiences',
        description: 'Turn your videos into podcasts and reach listeners on StreamView Music.',
        buttonText: 'New podcast',
        learnMoreLink: true,
        icon: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z',
        onClick: () => handleNotImplemented('Podcasts'),
      },
      promotions: {
        title: 'Promote your content to reach more viewers',
        description: 'Use ads to get your videos in front of the right audience.',
        buttonText: 'Get started',
        learnMoreLink: true,
        icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
        onClick: () => showToastMessage('Promotions setup opened - connect your Google Ads account to continue'),
      },
      collaborations: {
        title: 'Collaborate with other creators',
        description: 'Team up with other creators to cross-promote content.',
        icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      }
    };

    const state = emptyStates[tabId];
    if (!state) return null;

    return (
      <div className="bg-white border border-[#e5e5e5] rounded-md p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4 flex justify-center">
            <svg viewBox="0 0 24 24" className="w-24 h-24 fill-[#909090]">
              <path d={state.icon}></path>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-[#0d0d0d] mb-2">{state.title}</h2>
          <p className="text-sm text-[#606060] mb-6">{state.description}</p>
          {state.buttonText && (
            <button
              className="bg-[#065fd4] text-white px-4 py-2 rounded hover:bg-[#0553c2] font-medium text-sm"
              onClick={state.onClick}
            >
              {state.buttonText}
            </button>
          )}
          {state.learnMoreLink && (
            <div className="mt-3">
              <a
                href="#"
                className="text-[#065fd4] text-sm hover:underline"
                onClick={(event) => {
                  event.preventDefault();
                  handleNotImplemented('Learn more');
                }}
              >
                Learn more
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Channel content</h1>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-[#e5e5e5]">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#065fd4] border-b-2 border-[#065fd4]'
                  : 'text-[#606060] hover:text-[#0d0d0d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Tab - Full Component */}
      {activeTab === 'live' && (
        <LiveStreaming onNotImplemented={handleNotImplemented} />
      )}

      {/* Render empty state for other non-videos tabs */}
      {activeTab !== 'videos' && activeTab !== 'live' && renderEmptyState(activeTab)}

      {/* Videos Tab Content */}
      {activeTab === 'videos' && (
      <div className="bg-white border border-[#e5e5e5] rounded-md overflow-hidden shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-[#e5e5e5] flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#606060]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
            <span className="font-medium text-sm">Filter</span>
          </div>
          <input
            type="text"
            placeholder="Search videos by title or description..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="flex-1 px-3 py-2 border border-[#d0d0d0] rounded text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              className="text-[#606060] hover:text-[#0d0d0d] p-1"
              title="Clear filter"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-xl font-medium text-[#0d0d0d] mb-2">No videos yet</h2>
            <p className="text-sm text-[#606060] mb-6">Upload your first video to get started.</p>
            <button
              className="bg-[#065fd4] text-white px-4 py-2 rounded hover:bg-[#0553c2] font-medium text-sm"
              onClick={handleUploadClick}
            >
              Upload videos
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-3 border-b border-[#e5e5e5] bg-white text-xs font-medium text-[#606060] uppercase tracking-wider">
              <div className="col-span-5 pl-8">Video</div>
              <div className="col-span-1">Visibility</div>
              <div className="col-span-1">Restrictions</div>
              <button
                className="col-span-2 text-left hover:text-[#0d0d0d] flex items-center gap-1"
                onClick={() => handleSort('date')}
              >
                Date
                {sortColumn === 'date' && (
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}>
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                )}
              </button>
              <button
                className="col-span-1 text-right hover:text-[#0d0d0d] flex items-center justify-end gap-1"
                onClick={() => handleSort('views')}
              >
                Views
                {sortColumn === 'views' && (
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}>
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                )}
              </button>
              <button
                className="col-span-1 text-right hover:text-[#0d0d0d] flex items-center justify-end gap-1"
                onClick={() => handleSort('comments')}
              >
                Comments
                {sortColumn === 'comments' && (
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}>
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                )}
              </button>
              <button
                className="col-span-1 text-right hover:text-[#0d0d0d] flex items-center justify-end gap-1"
                onClick={() => handleSort('likes')}
              >
                Likes (vs. dislikes)
                {sortColumn === 'likes' && (
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}>
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#e5e5e5]">
              {rows.map((video, index) => {
                const videoId = getVideoId(video);
                const displayTitle =
                  video.title ||
                  video.asset?.original_filename ||
                  video.asset?.filename ||
                  video.filename ||
                  video.name ||
                  "Untitled video";
                const displayDescription = video.description || "Add description";
                const displayVisibility = video.visibility || video.privacy || "Private";
                const isPrivate = displayVisibility === "Private";
                const isUnlisted = displayVisibility === "Unlisted";
                const contentMd5 = video.asset?.content_md5 || video.content_md5;
                const uploadedDateSource = getVideoUploadDate(video);
                const uploadedDate = uploadedDateSource
                  ? new Date(uploadedDateSource).toLocaleDateString()
                  : "Draft";
                const viewCount = getVideoViews(video);
                const commentCount = getCommentCount(video);
                const likeValue = getLikeRatio(video);
                const displayDuration = video.duration || "0:00";

                return (
                  <div key={videoId || index} className="grid grid-cols-12 gap-4 p-3 hover:bg-[#f9f9f9] items-center group">
                  {/* Video Column */}
                  <div className="col-span-5 flex gap-4 items-start pl-2 relative">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                       <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div
                      className="w-28 h-16 bg-[#e5e5e5] flex-shrink-0 relative group-hover:ml-6 transition-all duration-75 cursor-pointer"
                      onClick={() => onVideoClick && onVideoClick(videoId)}
                    >
                      <img src={video.thumbnail} alt={displayTitle} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{displayDuration}</div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3
                        className="text-[#0d0d0d] text-sm font-medium truncate cursor-pointer hover:text-[#065fd4]"
                        onClick={() => onVideoClick && onVideoClick(videoId)}
                      >
                        {displayTitle}
                      </h3>
                      <p className="text-[#606060] text-xs truncate">{displayDescription}</p>
                      {contentMd5 && (
                        <p className="text-[10px] text-[#909090] font-mono truncate">md5: {contentMd5}</p>
                      )}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1 hover:text-[#0d0d0d] text-[#606060]"
                          title="Details"
                          onClick={() => onVideoClick && onVideoClick(videoId, 'details')}
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                        </button>
                        <button
                          className="p-1 hover:text-[#0d0d0d] text-[#606060]"
                          title="Analytics"
                          onClick={() => onVideoClick && onVideoClick(videoId, 'analytics')}
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></svg>
                        </button>
                        <button
                          className="p-1 hover:text-[#0d0d0d] text-[#606060]"
                          title="Comments"
                          onClick={() => onVideoClick && onVideoClick(videoId, 'comments')}
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>
                        </button>
                        <button
                          className="p-1 hover:text-[#0d0d0d] text-[#606060]"
                          title="View on StreamView"
                          onClick={() => handleViewOnStreamView(video)}
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M10 16.5l6-4.5-6-4.5v9zM5 20h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zM5 5h14v14H5V5z"></path></svg>
                        </button>
                        <div className="relative">
                          <button
                            className="p-1 hover:text-[#0d0d0d] text-[#606060]"
                            title="Options"
                            onClick={(e) => handleOptionsClick(videoId, e)}
                          >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                          </button>
                          {openOptionsMenu === videoId && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-[#e5e5e5] z-10">
                              <div className="py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-[#0d0d0d] hover:bg-[#f2f2f2]"
                                  onClick={() => handleGetShareableLink(videoId)}
                                >
                                  Get shareable link
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-[#0d0d0d] hover:bg-[#f2f2f2]"
                                  onClick={() => handleDownloadVideo(videoId)}
                                >
                                  Download
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-[#cc0000] hover:bg-[#f2f2f2]"
                                  onClick={() => handleDeleteVideo(videoId)}
                                >
                                  Delete forever
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visibility */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-1 text-[#0d0d0d] text-sm">
                      {isPrivate ? (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#606060]"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>
                      ) : isUnlisted ? (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#606060]"><path d="M3.9 12a5 5 0 0 1 5-5h4v2h-4a3 3 0 0 0 0 6h4v2h-4a5 5 0 0 1-5-5zm5.1 1h6v-2h-6v2zm6-6h-4V5h4a5 5 0 0 1 0 10h-4v-2h4a3 3 0 0 0 0-6z"></path></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#009933]"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                      )}
                      <span>{displayVisibility}</span>
                    </div>
                  </div>

                  {/* Restrictions */}
                  <div className="col-span-1 text-sm text-[#0d0d0d]">
                    {video.restrictions || "None"}
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-sm text-[#0d0d0d]">
                    <div>{uploadedDate}</div>
                    <div className="text-xs text-[#606060]">Uploaded</div>
                  </div>

                  {/* Views */}
                  <div className="col-span-1 text-right text-sm text-[#0d0d0d]">
                    {viewCount.toLocaleString()}
                  </div>

                  {/* Comments */}
                  <div className="col-span-1 text-right text-sm text-[#0d0d0d]">
                    <button
                      onClick={() => onVideoClick && onVideoClick(videoId, 'comments')}
                      className="text-[#065fd4] hover:underline cursor-pointer"
                    >
                      {commentCount}
                    </button>
                  </div>

                  {/* Likes */}
                  <div className="col-span-1 text-right text-sm text-[#0d0d0d]">
                    {likeValue}
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0d0d0d] text-white px-6 py-3 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
