import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './HomePage.css';

const LibraryPage = () => {
  const navigate = useNavigate();
  const { data } = useData();

  const historyVideos = data.user.watchHistory
    .map(h => data.videos.find(v => v.videoId === h.videoId))
    .filter(Boolean)
    .slice(0, 4);

  const userPlaylists = data.playlists.filter(p => p.creatorId === data.user.userId);

  return (
    <div className="home-page">
      <div style={{ marginBottom: '24px' }}>
        <h1>Library</h1>
      </div>

      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2>History</h2>
          <Link to="/history">View all</Link>
        </div>
        <div className="videos-grid">
          {historyVideos.map(video => (
            <div
              key={video.videoId}
              className="video-card"
              onClick={() => navigate(`/watch/${video.videoId}`)}
            >
              <div className="video-thumbnail-container">
                <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                <span className="video-duration">{video.duration}</span>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2>Watch Later</h2>
          <Link to="/watch-later">View all</Link>
        </div>
        <p>{data.user.watchLater.length} videos</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2>Liked Videos</h2>
          <Link to="/liked">View all</Link>
        </div>
        <p>{data.user.likedVideos.length} videos</p>
      </section>

      <section>
        <h2 style={{ marginBottom: '16px' }}>Playlists</h2>
        {userPlaylists.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No playlists yet</p>
        ) : (
          <div className="videos-grid">
            {userPlaylists.map(playlist => (
              <div
                key={playlist.playlistId}
                className="video-card"
                onClick={() => navigate(`/playlist/${playlist.playlistId}`)}
              >
                <div className="video-thumbnail-container">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.name}
                    className="video-thumbnail"
                  />
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
      </section>
    </div>
  );
};

export default LibraryPage;
