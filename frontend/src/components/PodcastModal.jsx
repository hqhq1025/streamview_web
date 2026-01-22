import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ShareModal.css';
import './PlaylistModal.css';

const PodcastModal = ({ isOpen, onClose, showToast }) => {
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'playlist', 'rss'
  const [podcastName, setPodcastName] = useState('');
  const [podcastDescription, setPodcastDescription] = useState('');
  const [podcastPrivacy, setPodcastPrivacy] = useState('Public');
  const [rssUrl, setRssUrl] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreatePodcast = () => {
    if (podcastName.trim()) {
      showToast('Podcast created successfully');
      setPodcastName('');
      setPodcastDescription('');
      setPodcastPrivacy('Public');
      onClose();
    } else {
      showToast('Please enter a podcast name');
    }
  };

  const handleSubmitRSS = () => {
    if (rssUrl.trim()) {
      showToast('RSS feed submitted for review');
      setRssUrl('');
      onClose();
    } else {
      showToast('Please enter an RSS feed URL');
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content playlist-modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Create podcast</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '24px',
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'create' ? '2px solid #065fd4' : '2px solid transparent',
                color: activeTab === 'create' ? '#065fd4' : '#606060',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Create new
            </button>
            <button
              onClick={() => setActiveTab('playlist')}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'playlist' ? '2px solid #065fd4' : '2px solid transparent',
                color: activeTab === 'playlist' ? '#065fd4' : '#606060',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              From playlist
            </button>
            <button
              onClick={() => setActiveTab('rss')}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'rss' ? '2px solid #065fd4' : '2px solid transparent',
                color: activeTab === 'rss' ? '#065fd4' : '#606060',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              RSS feed
            </button>
          </div>

          {/* Create New Tab */}
          {activeTab === 'create' && (
            <div>
              <p style={{ fontSize: '14px', color: '#606060', marginBottom: '20px' }}>
                Create a new podcast to organize your audio content. You can add episodes later.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#0d0d0d'
                }}>
                  Podcast name *
                </label>
                <input
                  type="text"
                  value={podcastName}
                  onChange={(e) => setPodcastName(e.target.value)}
                  placeholder="Enter podcast name"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid #065fd4'}
                  onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#0d0d0d'
                }}>
                  Description
                </label>
                <textarea
                  value={podcastDescription}
                  onChange={(e) => setPodcastDescription(e.target.value)}
                  placeholder="Tell viewers about your podcast"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid #065fd4'}
                  onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#0d0d0d'
                }}>
                  Privacy
                </label>
                <select
                  value={podcastPrivacy}
                  onChange={(e) => setPodcastPrivacy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                    outline: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Public">Public</option>
                  <option value="Unlisted">Unlisted</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    color: '#065fd4'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePodcast}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: '#065fd4',
                    color: 'white'
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {/* From Playlist Tab */}
          {activeTab === 'playlist' && (
            <div>
              <p style={{ fontSize: '14px', color: '#606060', marginBottom: '20px' }}>
                Convert an existing playlist into a podcast. This will make your content available via RSS feed.
              </p>

              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#606060',
                fontSize: '14px'
              }}>
                Select a playlist from your channel to convert it into a podcast.
                <br />
                <button
                  onClick={() => {
                    showToast('Playlist selection feature coming soon');
                  }}
                  style={{
                    marginTop: '20px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    color: '#065fd4'
                  }}
                >
                  Choose playlist
                </button>
              </div>
            </div>
          )}

          {/* RSS Feed Tab */}
          {activeTab === 'rss' && (
            <div>
              <p style={{ fontSize: '14px', color: '#606060', marginBottom: '20px' }}>
                Submit your existing RSS feed URL to import your podcast to StreamView.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#0d0d0d'
                }}>
                  RSS feed URL *
                </label>
                <input
                  type="url"
                  value={rssUrl}
                  onChange={(e) => setRssUrl(e.target.value)}
                  placeholder="https://example.com/podcast/feed.xml"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid #065fd4'}
                  onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                />
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '2px',
                fontSize: '12px',
                color: '#606060',
                marginBottom: '24px'
              }}>
                <strong>Note:</strong> Your RSS feed will be reviewed before it appears on StreamView.
                This process may take a few days.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    color: '#065fd4'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRSS}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: '#065fd4',
                    color: 'white'
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastModal;
