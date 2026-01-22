
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Mic, Plus, Bell, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useData } from '../context/DataContext';
import './Header.css';

const COOKIE_NAME = import.meta.env.VITE_COOKIE_NAME || 'user_id';

const Header = ({ onMenuClick, theme, onThemeToggle }) => {
  const navigate = useNavigate();
  const { data, markNotificationAsRead, markAllNotificationsAsRead, showToast } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [voiceSearchText, setVoiceSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const unreadCount = data.notifications.filter(n => !n.isRead).length;

  const handleVoiceSearch = () => {
    setShowVoiceSearch(true);
    setVoiceSearchText('');

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice search is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setVoiceSearchText(finalTranscript || interimTranscript);

        if (finalTranscript) {
          setTimeout(() => {
            if (finalTranscript.trim()) {
              navigate(`/search?q=${encodeURIComponent(finalTranscript)}`);
              setShowVoiceSearch(false);
              setIsListening(false);
            }
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          showToast(`Voice search error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      showToast('Could not start voice search. Please try again.');
    }
  };

  const closeVoiceSearch = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setShowVoiceSearch(false);
    setVoiceSearchText('');
    setIsListening(false);
  };

  const handleSignOut = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    sessionStorage.clear();

    // Show a confirmation message
    showToast('Signed out successfully');

    // Redirect to home page or login page
    // In a real app, this would redirect to a login page
    // For now, we'll just reload the page to reset the state
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.notificationId);
    } catch (err) {
      console.error(err);
    }
    if (notification.videoId) {
      navigate(`/watch/${notification.videoId}`);
      setShowNotifications(false);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getCookieValue = (name) => {
    if (typeof document === 'undefined') return '';
    const entry = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`));
    if (!entry) return '';
    const [, value] = entry.split('=');
    return decodeURIComponent(value || '');
  };

  const buildStudioUrl = () => {
    if (typeof window === 'undefined') {
      return '/studio?upload=1';
    }

    const { protocol, hostname, port, search } = window.location;
    const params = new URLSearchParams(search);
    params.set('upload', '1');
    const query = params.toString();
    const portSuffix = port ? `:${port}` : '';
    const withQuery = (url) => (query ? `${url}?${query}` : url);

    if (hostname.startsWith('streamview.')) {
      const suffix = hostname.slice('streamview.'.length);
      const cookieValue = getCookieValue(COOKIE_NAME);
      if (cookieValue) {
        params.set('cookie', cookieValue);
      }
      const nextQuery = params.toString();
      const withCookieQuery = (url) => (nextQuery ? `${url}?${nextQuery}` : url);
      return withCookieQuery(`${protocol}//studio.streamview.${suffix}${portSuffix}/`);
    }

    return withQuery(`${protocol}//${window.location.host}/studio`);
  };

  const handleCreate = () => {
    const target = buildStudioUrl();
    window.location.assign(target);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick} aria-label="Menu">
          <Menu size={24} />
        </button>
        <Link to="/" className="logo">
          <div className="logo-icon">▶</div>
          <span>StreamView</span>
        </Link>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
              <Search size={20} />
            </button>
          </div>
        </form>
        <button
          className="voice-button"
          aria-label="Voice search"
          onClick={handleVoiceSearch}
        >
          <Mic size={20} />
        </button>
      </div>

      <div className="header-right">
        <button className="icon-button" aria-label="Create" onClick={handleCreate}>
          <Plus size={24} />
        </button>
        
        <button 
          className="icon-button" 
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        {showNotifications && (
          <div className="notifications-panel" ref={notifRef}>
            <div className="notifications-header">
              <h3>Notifications</h3>
              <button
                className="mark-read-button"
                onClick={async () => {
                  try {
                    await markAllNotificationsAsRead();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Mark all as read
              </button>
            </div>
            <div className="notifications-list">
              {data.notifications.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No notifications
                </div>
              ) : (
                data.notifications.map(notif => (
                  <div
                    key={notif.notificationId}
                    className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <img 
                      src={notif.channelAvatar} 
                      alt={notif.channelName}
                      className="notification-avatar"
                    />
                    <div className="notification-content">
                      <div className="notification-text">
                        <strong>{notif.channelName}</strong> uploaded: {notif.videoTitle}
                      </div>
                      <div className="notification-time">{formatTime(notif.timestamp)}</div>
                    </div>
                    {notif.videoThumbnail && (
                      <img 
                        src={notif.videoThumbnail} 
                        alt=""
                        className="notification-thumbnail"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <img
          src={data.user.avatar}
          alt={data.user.displayName}
          className="user-avatar"
          onClick={() => setShowUserMenu(!showUserMenu)}
        />

        {showUserMenu && (
          <div className="user-menu" ref={userMenuRef}>
            <div className="user-menu-header">
              <img src={data.user.avatar} alt={data.user.displayName} className="user-menu-avatar" />
              <div className="user-menu-info">
                <div className="user-menu-name">{data.user.displayName}</div>
                <div className="user-menu-handle">{data.user.handle}</div>
              </div>
            </div>
            <div className="user-menu-list">
              <Link
                to={`/channel/${data.user.channelId || data.user.userId}`}
                className="user-menu-item"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={20} />
                <span>Your channel</span>
              </Link>
              <div className="user-menu-divider" />
              <Link to="/settings" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <div className="user-menu-item">
                <div className="theme-toggle">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>Appearance: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </div>
                  <div 
                    className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
                    onClick={onThemeToggle}
                  >
                    <div className="theme-switch-thumb" />
                  </div>
                </div>
              </div>
              <div className="user-menu-divider" />
              <button
                type="button"
                className="user-menu-item"
                onClick={handleSignOut}
              >
                <LogOut size={20} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showVoiceSearch && (
        <div className="voice-search-overlay" onClick={closeVoiceSearch}>
          <div className="voice-search-modal" onClick={(e) => e.stopPropagation()}>
            <button className="voice-search-close" onClick={closeVoiceSearch}>×</button>
            <div className="voice-search-content">
              <div className={`voice-search-mic ${isListening ? 'listening' : ''}`}>
                <Mic size={48} />
              </div>
              <div className="voice-search-status">
                {isListening ? 'Listening...' : 'Click the microphone to start'}
              </div>
              {voiceSearchText && (
                <div className="voice-search-text">{voiceSearchText}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
  
