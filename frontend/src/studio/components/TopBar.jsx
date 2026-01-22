import React, { useState, useRef, useEffect } from 'react';

export default function TopBar({ onCreateClick, onMenuClick, channelName, onNotImplemented, onSearch }) {
  const displayName = (channelName || "").trim() || "Tony's Channel";
  const channelInitial = displayName.charAt(0).toUpperCase() || "T";
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const searchRef = useRef(null);
  const helpRef = useRef(null);
  const notificationsRef = useRef(null);
  const accountRef = useRef(null);

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && typeof onSearch === 'function') {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim() && typeof onSearch === 'function') {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelpMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-16 bg-white border-b border-[#e5e5e5] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-[#f2f2f2] rounded-full"
          onClick={onMenuClick}
          title="Collapse menu"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <img src="/youtube_studio_logo.png" alt="Studio" className="h-6" onError={(e) => e.target.style.display = 'none'} />
          <span className="text-xl font-semibold tracking-tight text-[#0d0d0d]">Studio</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search across your channel"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
            className="w-full bg-white border border-[#cccccc] text-[#0d0d0d] px-4 py-2 rounded-sm focus:outline-none focus:border-blue-500 placeholder-[#606060]"
          />
          <button
            type="button"
            className="absolute right-0 top-0 h-full px-3 hover:bg-[#f2f2f2]"
            onClick={handleSearchClick}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </button>

          {showSuggestions && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e5e5] rounded-sm shadow-lg max-h-96 overflow-y-auto z-50">
              <div className="p-3 text-sm text-[#606060]">
                Press Enter to search for "{searchQuery}"
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={helpRef}>
          <button
            className={`p-2 hover:bg-[#f2f2f2] rounded-full ${showHelpMenu ? 'bg-[#f2f2f2]' : ''}`}
            onClick={() => setShowHelpMenu(!showHelpMenu)}
            title="Help"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
            </svg>
          </button>

          {showHelpMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-[#e5e5e5] rounded shadow-lg w-64 py-2 z-50">
              <div className="px-4 py-3 border-b border-[#e5e5e5]">
                <div className="font-medium text-sm text-[#0d0d0d]">Help & Support</div>
              </div>
              <a
                href="https://support.google.com/youtube/topic/9257498"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
              >
                StreamView Studio Help
              </a>
              <a
                href="https://creatoracademy.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
              >
                Creator Academy
              </a>
              <a
                href="https://support.google.com/youtube/community"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
              >
                Community Help
              </a>
              <div className="border-t border-[#e5e5e5] my-2"></div>
              <button
                onClick={() => {
                  setShowHelpMenu(false);
                  handleNotImplemented('Send feedback');
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
              >
                Send feedback
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            className={`p-2 hover:bg-[#f2f2f2] rounded-full relative ${showNotifications ? 'bg-[#f2f2f2]' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
            </svg>
            <div className="absolute top-1 right-1 bg-[#ff0000] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              2
            </div>
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-[#e5e5e5] rounded shadow-lg w-96 z-50">
              <div className="px-4 py-3 border-b border-[#e5e5e5] flex items-center justify-between">
                <div className="font-medium text-base text-[#0d0d0d]">Notifications</div>
                <button
                  onClick={() => handleNotImplemented('Mark all as read')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="hover:bg-[#f9f9f9] border-b border-[#e5e5e5]">
                  <div className="px-4 py-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-600">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-[#0d0d0d] mb-1">
                          Your video <span className="font-medium">Ultimate Gaming Setup Tour 2024</span> has reached 1 million views!
                        </div>
                        <div className="text-xs text-[#606060]">2 hours ago</div>
                      </div>
                      <button
                        onClick={() => handleNotImplemented('Mark as read')}
                        className="text-blue-600 text-xs hover:underline flex-shrink-0"
                      >
                        Mark as read
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hover:bg-[#f9f9f9] border-b border-[#e5e5e5]">
                  <div className="px-4 py-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-green-600">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-[#0d0d0d] mb-1">
                          New comment on <span className="font-medium">iPhone 15 Pro Max Review</span>
                        </div>
                        <div className="text-xs text-[#606060]">5 hours ago</div>
                      </div>
                      <button
                        onClick={() => handleNotImplemented('Mark as read')}
                        className="text-blue-600 text-xs hover:underline flex-shrink-0"
                      >
                        Mark as read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 border border-[#cccccc] px-3 py-1.5 rounded-sm hover:bg-[#f2f2f2] text-[#0d0d0d] font-medium" onClick={onCreateClick}>
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#ff4e45]">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path>
          </svg>
          <span className="text-[#0d0d0d] font-medium text-sm">CREATE</span>
        </button>

        <div className="relative" ref={accountRef}>
          <button
            className={`p-2 hover:bg-[#f2f2f2] rounded-full ${showAccountMenu ? 'bg-[#f2f2f2]' : ''}`}
            title={displayName}
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {channelInitial}
            </div>
          </button>

          {showAccountMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-[#e5e5e5] rounded shadow-lg w-72 py-2 z-50">
              <div className="px-4 py-3 border-b border-[#e5e5e5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {channelInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#0d0d0d] truncate">{displayName}</div>
                    <div className="text-xs text-[#606060] truncate">@{displayName.toLowerCase().replace(/\s+/g, '')}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  handleNotImplemented('Your channel');
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d] flex items-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"></path>
                </svg>
                Your channel
              </button>
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  handleNotImplemented('Google Account');
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d] flex items-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                </svg>
                Google Account
              </button>
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  handleNotImplemented('Switch account');
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d] flex items-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
                </svg>
                Switch account
              </button>
              <div className="border-t border-[#e5e5e5] my-2"></div>
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  handleNotImplemented('Sign out');
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d] flex items-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
