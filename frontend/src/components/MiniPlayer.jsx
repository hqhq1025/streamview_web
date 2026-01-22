
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Maximize2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import './MiniPlayer.css';

const MiniPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { miniPlayer, setMiniPlayer } = useData();

  useEffect(() => {
    if (location.pathname.startsWith('/watch/')) {
      setMiniPlayer(null);
    }
  }, [location, setMiniPlayer]);

  if (!miniPlayer || location.pathname.startsWith('/watch/')) {
    return null;
  }

  const handleExpand = () => {
    navigate(`/watch/${miniPlayer.videoId}`);
  };

  const handleClose = () => {
    setMiniPlayer(null);
  };

  const isFileVideo = (source) => {
    if (!source) return false;
    const lower = source.toLowerCase();
    if (lower.includes('youtube.com/embed/') || lower.includes('youtube-nocookie.com/embed/')) {
      return false;
    }
    if (lower.includes('/api/files/') || lower.startsWith('blob:') || lower.startsWith('data:')) {
      return true;
    }
    return /\.(mp4|webm|ogg)(\?|$)/.test(lower);
  };

  return (
    <div className="mini-player">
      {isFileVideo(miniPlayer.videoUrl) ? (
        <video
          className="mini-player-video"
          src={miniPlayer.videoUrl}
          controls
          playsInline
        />
      ) : (
        <iframe
          className="mini-player-video"
          src={miniPlayer.videoUrl}
          title={miniPlayer.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      <div className="mini-player-controls">
        <div className="mini-player-info">
          <div className="mini-player-title">{miniPlayer.title}</div>
          <div className="mini-player-channel">{miniPlayer.channelName}</div>
        </div>
        <div className="mini-player-buttons">
          <button className="mini-player-button" onClick={handleExpand} aria-label="Expand">
            <Maximize2 size={20} />
          </button>
          <button className="mini-player-button" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
  
