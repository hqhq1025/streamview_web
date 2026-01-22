
import React, { useState } from 'react';
import { X, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, videoId }) => {
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const { showToast } = useData();
  const baseUrl = `${window.location.origin}/watch/${videoId}`;
  const shareUrl = includeTimestamp ? `${baseUrl}?t=0` : baseUrl;

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!');
    } catch (err) {
      console.error(err);
      showToast('Unable to copy link');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSocialShare = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
    };
    const target = urls[platform];
    if (!target) return;
    window.open(target, '_blank', 'noopener');
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Share</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="share-options">
          <div className="share-link-section">
            <input
              type="text"
              className="share-link-input"
              value={shareUrl}
              readOnly
            />
            <button className="copy-button" onClick={handleCopyLink}>
              Copy
            </button>
          </div>

          <div className="timestamp-checkbox">
            <input
              type="checkbox"
              id="timestamp"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
            />
            <label htmlFor="timestamp">Start at current time</label>
          </div>

          <div className="social-buttons">
            <button className="social-button" onClick={() => handleSocialShare('facebook')}>
              <Facebook size={20} />
              <span>Facebook</span>
            </button>
            <button className="social-button" onClick={() => handleSocialShare('twitter')}>
              <Twitter size={20} />
              <span>Twitter</span>
            </button>
            <button className="social-button" onClick={() => handleSocialShare('whatsapp')}>
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
  
