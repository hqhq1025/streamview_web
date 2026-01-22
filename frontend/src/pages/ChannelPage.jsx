
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './ChannelPage.css';

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { data, toggleSubscription, showToast } = useData();
  const [activeTab, setActiveTab] = useState('videos');
  
  const channelFromList = data.channels.find(c => c.channelId === channelId);
  const isOwnChannel = channelId === data.user.channelId || channelId === data.user.userId;
  const fallbackChannel = isOwnChannel
    ? {
        channelId,
        name: data.user.displayName || 'Your Channel',
        handle: data.user.handle || '@you',
        avatar: data.user.avatar,
        banner: 'https://picsum.photos/1600/400?random=channel-self',
        description: 'Welcome to your official channel.',
        subscriberCount: 0,
        videoCount: 0,
        joinedDate: '2020-01-01',
        links: [],
        videos: [],
      }
    : null;
  const channel = channelFromList || fallbackChannel;
  const channelVideos = data.videos.filter((video) => {
    if (video.channelId === channelId) return true;
    return isOwnChannel && video.origin === 'studio' && !video.channelId;
  });
  const isSubscribed = channel ? data.user.subscribedChannels.includes(channelId) : false;

  if (!channel) {
    return <div style={{ padding: '24px' }}>Channel not found</div>;
  }
  const channelVideoCount = channel.videoCount ?? channelVideos.length;

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

  const handleSubscribe = async () => {
    try {
      await toggleSubscription(channelId);
      showToast(isSubscribed ? 'Unsubscribed' : 'Subscribed');
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <div className="channel-page">
      <img src={channel.banner} alt={channel.name} className="channel-banner" />
      
      <div className="channel-header">
        <div className="channel-header-content">
          <img src={channel.avatar} alt={channel.name} className="channel-avatar-xl" />
          <div className="channel-info">
            <h1 className="channel-name-large">{channel.name}</h1>
            <div className="channel-handle">{channel.handle}</div>
            <div className="channel-stats">
              {formatViewCount(channel.subscriberCount)} subscribers • {channelVideoCount} videos
            </div>
          </div>
          <button 
            className={`subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
            onClick={handleSubscribe}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
      </div>

      <div className="channel-tabs">
        <div 
          className={`channel-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </div>
        <div 
          className={`channel-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </div>
        <div 
          className={`channel-tab ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </div>
        <div 
          className={`channel-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </div>
      </div>

      <div className="channel-content">
        {activeTab === 'videos' && (
          <div className="channel-videos-grid">
            {channelVideos.map(video => (
              <div 
                key={video.videoId}
                className="video-card"
                onClick={() => handleVideoClick(video.videoId)}
              >
                <div className="video-thumbnail-container">
                  <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-info">
                  <div className="video-details" style={{ marginLeft: 0 }}>
                    <div className="video-title">{video.title}</div>
                    <div className="video-metadata">
                      {formatViewCount(video.viewCount)} views • {formatTimeAgo(video.uploadDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="channel-about">
            <div className="about-section">
              <h3>Description</h3>
              <p>{channel.description}</p>
            </div>
            <div className="about-section">
              <h3>Channel Details</h3>
              <p>Joined {new Date(channel.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            {channel.links && channel.links.length > 0 && (
              <div className="about-section">
                <h3>Links</h3>
                <div className="about-links">
                  {channel.links.map((link, index) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="about-link">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'home' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Featured Videos</h2>
            <div className="channel-videos-grid">
              {channelVideos.slice(0, 8).map(video => (
                <div 
                  key={video.videoId}
                  className="video-card"
                  onClick={() => handleVideoClick(video.videoId)}
                >
                  <div className="video-thumbnail-container">
                    <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <div className="video-info">
                    <div className="video-details" style={{ marginLeft: 0 }}>
                      <div className="video-title">{video.title}</div>
                      <div className="video-metadata">
                        {formatViewCount(video.viewCount)} views • {formatTimeAgo(video.uploadDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            {data.playlists.filter(p => p.creatorId === channelId).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No playlists available</p>
            ) : (
              <div className="channel-videos-grid">
                {data.playlists
                  .filter(p => p.creatorId === channelId)
                  .map(playlist => (
                    <div key={playlist.playlistId} className="video-card">
                      <div className="video-thumbnail-container">
                        <img src={playlist.thumbnail} alt={playlist.name} className="video-thumbnail" />
                        <span className="video-duration">{playlist.videoIds.length} videos</span>
                      </div>
                      <div className="video-info">
                        <div className="video-details" style={{ marginLeft: 0 }}>
                          <div className="video-title">{playlist.name}</div>
                          <div className="video-metadata">{playlist.privacy}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
  
