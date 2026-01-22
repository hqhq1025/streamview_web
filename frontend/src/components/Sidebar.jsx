
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Play, Folder, User, History, Clock, ThumbsUp, ListVideo, TrendingUp, Music, Gamepad2, Newspaper, Trophy, GraduationCap, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, isMini }) => {
  const location = useLocation();
  const { data, showToast } = useData();
  const [showAllSubscriptions, setShowAllSubscriptions] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const allSubscribedChannels = data.channels.filter(channel =>
    data.user.subscribedChannels.includes(channel.channelId)
  );
  const subscribedChannels = showAllSubscriptions
    ? allSubscribedChannels
    : allSubscribedChannels.slice(0, 7);

  return (
    <aside className={`sidebar ${isMini ? 'mini' : ''} ${!isOpen ? 'closed' : ''}`}>
      <div className="sidebar-section">
        <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
          <Home size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Home</span>
        </Link>
        <Link to="/shorts" className={`sidebar-item ${isActive('/shorts') ? 'active' : ''}`}>
          <Play size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Shorts</span>
        </Link>
        <Link to="/subscriptions" className={`sidebar-item ${isActive('/subscriptions') ? 'active' : ''}`}>
          <Folder size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Subscriptions</span>
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">You</div>
        <Link to={`/channel/${data.user.userId}`} className="sidebar-item">
          <User size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Your channel</span>
        </Link>
        <Link to="/history" className={`sidebar-item ${isActive('/history') ? 'active' : ''}`}>
          <History size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">History</span>
        </Link>
        <Link to="/watch-later" className={`sidebar-item ${isActive('/watch-later') ? 'active' : ''}`}>
          <Clock size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Watch later</span>
        </Link>
        <Link to="/liked" className={`sidebar-item ${isActive('/liked') ? 'active' : ''}`}>
          <ThumbsUp size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Liked videos</span>
        </Link>
        <Link to="/library" className={`sidebar-item ${isActive('/library') ? 'active' : ''}`}>
          <ListVideo size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Library</span>
        </Link>
      </div>

      {subscribedChannels.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Subscriptions</div>
          {subscribedChannels.map(channel => (
            <Link 
              key={channel.channelId}
              to={`/channel/${channel.channelId}`}
              className="subscription-item"
            >
              <img src={channel.avatar} alt={channel.name} className="subscription-avatar" />
              <span className="subscription-name">{channel.name}</span>
            </Link>
          ))}
          {allSubscribedChannels.length > 7 && (
            <button
              className="show-more-button"
              onClick={() => setShowAllSubscriptions(!showAllSubscriptions)}
            >
              <ChevronDown size={24} style={{ transform: showAllSubscriptions ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              <span>
                {showAllSubscriptions
                  ? 'Show less'
                  : `Show ${allSubscribedChannels.length - 7} more`}
              </span>
            </button>
          )}
        </div>
      )}

      <div className="sidebar-section">
        <div className="sidebar-section-title">Explore</div>
        <Link to="/trending" className={`sidebar-item ${isActive('/trending') ? 'active' : ''}`}>
          <TrendingUp size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Trending</span>
        </Link>
        <Link to="/music" className={`sidebar-item ${isActive('/music') ? 'active' : ''}`}>
          <Music size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Music</span>
        </Link>
        <Link to="/gaming" className={`sidebar-item ${isActive('/gaming') ? 'active' : ''}`}>
          <Gamepad2 size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Gaming</span>
        </Link>
        <Link to="/news" className={`sidebar-item ${isActive('/news') ? 'active' : ''}`}>
          <Newspaper size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">News</span>
        </Link>
        <Link to="/sports" className={`sidebar-item ${isActive('/sports') ? 'active' : ''}`}>
          <Trophy size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Sports</span>
        </Link>
        <Link to="/learning" className={`sidebar-item ${isActive('/learning') ? 'active' : ''}`}>
          <GraduationCap size={24} className="sidebar-item-icon" />
          <span className="sidebar-item-text">Learning</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
  
