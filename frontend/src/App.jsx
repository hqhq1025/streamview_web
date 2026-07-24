
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import ChannelPage from './pages/ChannelPage';
import SearchPage from './pages/SearchPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import WatchLaterPage from './pages/WatchLaterPage';
import HistoryPage from './pages/HistoryPage';
import LikedVideosPage from './pages/LikedVideosPage';
import LibraryPage from './pages/LibraryPage';
import TrendingPage from './pages/TrendingPage';
import SettingsPage from './pages/SettingsPage';
import PlaylistPage from './pages/PlaylistPage';
import MiniPlayer from './components/MiniPlayer';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMini, setSidebarMini] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    if (sidebarOpen && !sidebarMini) {
      setSidebarMini(true);
    } else if (sidebarOpen && sidebarMini) {
      setSidebarOpen(false);
      setSidebarMini(false);
    } else {
      setSidebarOpen(true);
      setSidebarMini(false);
    }
  };

  return (
    <Router>
      <DataProvider>
        <div className="app">
          <Header 
            onMenuClick={toggleSidebar} 
            theme={theme}
            onThemeToggle={toggleTheme}
          />
          <div className="app-body">
            <Sidebar 
              isOpen={sidebarOpen} 
              isMini={sidebarMini}
            />
            <main className={`main-content ${sidebarOpen ? (sidebarMini ? 'sidebar-mini' : 'sidebar-open') : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
                <Route path="/channel/:channelId" element={<ChannelPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/watch-later" element={<WatchLaterPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/liked" element={<LikedVideosPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
          <MiniPlayer />
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;
