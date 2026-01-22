
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Clock, ListPlus, Share2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import PlaylistModal from '../components/PlaylistModal';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { data, toggleWatchLater, showToast } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(null);
  const [playlistVideoId, setPlaylistVideoId] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
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

  const filteredVideos = selectedCategory === 'All' 
    ? data.videos 
    : data.videos.filter(v => v.category === selectedCategory);

  const handleVideoClick = (videoId, e) => {
    if (e.target.closest('.video-card-menu') || e.target.closest('.video-menu-dropdown')) {
      return;
    }
    navigate(`/watch/${videoId}`);
  };

  const handleMenuClick = (e, videoId) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === videoId ? null : videoId);
  };

  const handleAddToWatchLater = async (e, video) => {
    e.stopPropagation();
    try {
      await toggleWatchLater(video.videoId);
      const isInWatchLater = data.user.watchLater.includes(video.videoId);
      showToast(isInWatchLater ? 'Removed from Watch later' : 'Added to Watch later');
      setMenuOpen(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (e, video) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/watch/${video.videoId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard');
    } catch (err) {
      console.error(err);
      showToast('Unable to copy link');
    } finally {
      setMenuOpen(null);
    }
  };

  const handlePlaylist = (e, video) => {
    e.stopPropagation();
    setPlaylistVideoId(video.videoId);
    setShowPlaylistModal(true);
    setMenuOpen(null);
  };

  return (
    <div className="home-page">
      <div className="category-chips">
        {data.categories.map(category => (
          <button
            key={category}
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="videos-grid">
        {filteredVideos.map(video => (
          <div 
            key={video.videoId} 
            className="video-card"
            onClick={(e) => handleVideoClick(video.videoId, e)}
          >
            <div className="video-thumbnail-container">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="video-thumbnail"
              />
              <span className="video-duration">{video.duration}</span>
              <button 
                className="video-card-menu"
                onClick={(e) => handleMenuClick(e, video.videoId)}
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>
              {menuOpen === video.videoId && (
                <div className="video-menu-dropdown" ref={menuRef}>
                  <div 
                    className="video-menu-item"
                    onClick={(e) => handleAddToWatchLater(e, video)}
                  >
                    <Clock size={20} />
                    <span>
                      {data.user.watchLater.includes(video.videoId) 
                        ? 'Remove from Watch later' 
                        : 'Add to Watch later'}
                    </span>
                  </div>
                  <div 
                    className="video-menu-item"
                    onClick={(e) => handleShare(e, video)}
                  >
                    <Share2 size={20} />
                    <span>Share</span>
                  </div>
                  <div
                    className="video-menu-item"
                    onClick={(e) => handlePlaylist(e, video)}
                  >
                    <ListPlus size={20} />
                    <span>Add to playlist</span>
                  </div>
                </div>
              )}
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
      <PlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => {
          setShowPlaylistModal(false);
          setPlaylistVideoId(null);
        }}
        videoId={playlistVideoId}
      />
    </div>
  );
};

export default HomePage;
  
