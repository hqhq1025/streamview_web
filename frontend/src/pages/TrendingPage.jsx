import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './HomePage.css';

const TrendingPage = () => {
  const navigate = useNavigate();
  const { data } = useData();

  const trendingVideos = [...data.videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 20);

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
      <div style={{ marginBottom: '24px' }}>
        <h1>Trending</h1>
      </div>
      <div className="videos-grid">
        {trendingVideos.map((video, index) => (
          <div
            key={video.videoId}
            className="video-card"
            onClick={() => navigate(`/watch/${video.videoId}`)}
          >
            <div className="video-thumbnail-container">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <span className="video-duration">{video.duration}</span>
              <span
                className="video-duration"
                style={{ left: '8px', right: 'auto' }}
              >
                #{index + 1}
              </span>
            </div>
            <div className="video-info">
              <img
                src={video.channelAvatar}
                alt={video.channelName}
                className="channel-avatar-small"
              />
              <div className="video-details">
                <div className="video-title">{video.title}</div>
                <div className="video-channel-name">{video.channelName}</div>
                <div className="video-metadata">
                  {formatViewCount(video.viewCount)} views • {formatTimeAgo(video.uploadDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
