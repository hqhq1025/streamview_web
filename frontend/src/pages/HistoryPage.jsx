import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './HomePage.css';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { data, removeFromHistory, clearHistory } = useData();

  const historyVideos = data.user.watchHistory
    .map(h => {
      const video = data.videos.find(v => v.videoId === h.videoId);
      return video ? { ...video, watchedAt: h.watchedAt } : null;
    })
    .filter(Boolean);

  const formatViewCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    return 'Today';
  };

  return (
    <div className="home-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Watch History</h1>
          <p>{historyVideos.length} videos</p>
        </div>
        <button
          onClick={async () => {
            try {
              await clearHistory();
            } catch (err) {
              console.error(err);
            }
          }}
          style={{
            border: '1px solid var(--border-color)',
            padding: '8px 16px',
            borderRadius: '18px',
            background: 'var(--hover-bg)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          Clear all
        </button>
      </div>
      <div className="videos-grid">
        {historyVideos.map(video => (
          <div key={video.videoId} className="video-card">
            <div
              className="video-thumbnail-container"
              onClick={() => navigate(`/watch/${video.videoId}`)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail"
              />
              <span className="video-duration">{video.duration}</span>
            </div>
            <div className="video-info">
              <img
                src={video.channelAvatar}
                alt={video.channelName}
                className="channel-avatar-small"
                onClick={() => navigate(`/channel/${video.channelId}`)}
              />
              <div className="video-details">
                <div className="video-title">{video.title}</div>
                <div className="video-channel-name">{video.channelName}</div>
                <div className="video-metadata">
                  {formatViewCount(video.viewCount)} views • {formatTimeAgo(video.uploadDate)}
                </div>
                <button
                  onClick={async () => {
                    try {
                      await removeFromHistory(video.videoId);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  style={{
                    marginTop: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
