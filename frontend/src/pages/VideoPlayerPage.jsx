import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Download,
  ListPlus,
  Minimize2,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ShareModal from '../components/ShareModal';
import PlaylistModal from '../components/PlaylistModal';
import './VideoPlayerPage.css';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const {
    data,
    addToWatchHistory,
    toggleLike,
    toggleDislike,
    toggleSubscription,
    addComment,
    toggleCommentLike,
    toggleCommentDislike,
    showToast,
    setMiniPlayer,
  } = useData();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentActions, setShowCommentActions] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const lastHistoryVideoId = useRef(null);

  const video = data.videos.find(v => v.videoId === videoId);
  const resolvedChannelId =
    video?.channelId || data.user.channelId || data.user.userId || 'creator-channel';
  const isCreatorVideo = Boolean(video) && (
    video.origin === 'studio' ||
    resolvedChannelId === data.user.channelId ||
    resolvedChannelId === data.user.userId
  );
  const fallbackChannel = video && isCreatorVideo
    ? {
        channelId: resolvedChannelId,
        name: video.channelName || data.user.displayName || 'Your Channel',
        handle: data.user.handle || '@creator',
        avatar: video.channelAvatar || data.user.avatar,
        banner: 'https://picsum.photos/1600/400?random=channel-self',
        description: 'Welcome to your official channel.',
        subscriberCount: 0,
        videoCount: 0,
        joinedDate: '2020-01-01',
        links: [],
        videos: [],
      }
    : null;
  const channel = video
    ? data.channels.find(c => c.channelId === resolvedChannelId) || fallbackChannel
    : null;
  const comments = video ? (data.comments[videoId] || []) : [];
  const isLiked = video ? data.user.likedVideos.includes(videoId) : false;
  const isDisliked = video ? data.user.dislikedVideos.includes(videoId) : false;
  const isSubscribed = channel ? data.user.subscribedChannels.includes(channel.channelId) : false;
  const commentReactions = data.user.commentReactions || {};
  const viewCount = Number.isFinite(video?.viewCount)
    ? video.viewCount
    : (Number.isFinite(video?.views) ? video.views : 0);
  const likeCount = Number.isFinite(video?.likeCount) ? video.likeCount : 0;
  const uploadDate = video?.uploadDate || video?.uploaded_at || video?.date;
  const playerSource = video?.videoUrl || video?.asset?.url || video?.watchUrl;
  const isFileVideo = (source) => {
    if (!source) return false;
    if (video?.origin === 'studio') return true;
    const lower = source.toLowerCase();
    if (lower.includes('youtube.com/embed/') || lower.includes('youtube-nocookie.com/embed/')) {
      return false;
    }
    if (lower.includes('/api/files/') || lower.startsWith('blob:') || lower.startsWith('data:')) {
      return true;
    }
    return /\.(mp4|webm|ogg)(\?|$)/.test(lower);
  };

  const suggestedVideos = data.videos
    .filter(v => v.videoId !== videoId && (v.category === video?.category || v.channelId === video?.channelId))
    .slice(0, 10);

  useEffect(() => {
    if (!video) return;
    if (lastHistoryVideoId.current === videoId) return;
    lastHistoryVideoId.current = videoId;
    void addToWatchHistory(videoId);
  }, [video, videoId, addToWatchHistory]);

  if (!video || !channel) {
    return <div style={{ padding: '24px' }}>Video not found</div>;
  }

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

  const handleLike = async () => {
    try {
      await toggleLike(videoId);
      showToast(isLiked ? 'Removed from liked videos' : 'Added to liked videos');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      await toggleDislike(videoId);
      showToast(isDisliked ? 'Removed dislike' : 'Disliked video');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    try {
      await toggleSubscription(channel.channelId);
      showToast(isSubscribed ? 'Unsubscribed' : 'Subscribed');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleSave = () => {
    setShowPlaylistModal(true);
  };

  const handleMiniPlayer = () => {
    const miniSource = playerSource || video.videoUrl;
    setMiniPlayer({
      videoId: video.videoId,
      title: video.title,
      channelName: video.channelName,
      videoUrl: miniSource,
    });
    navigate('/');
  };

  const handleDownload = () => {
    const downloadUrl = video.watchUrl || video.asset?.url;
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener');
      return;
    }
    showToast('Download unavailable for this video.');
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      try {
        await addComment(videoId, commentText);
        setCommentText('');
        setShowCommentActions(false);
        showToast('Comment added');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (replyText.trim()) {
      try {
        await addComment(videoId, replyText, parentCommentId);
        setReplyText('');
        setReplyingTo(null);
        showToast('Reply added');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCommentReaction = async (commentId, reaction) => {
    try {
      if (reaction === 'like') {
        await toggleCommentLike(commentId);
        const next = commentReactions[commentId] === 'like' ? 'Removed like' : 'Liked comment';
        showToast(next);
        return;
      }
      if (reaction === 'dislike') {
        await toggleCommentDislike(commentId);
        const next = commentReactions[commentId] === 'dislike' ? 'Removed dislike' : 'Disliked comment';
        showToast(next);
      }
    } catch (err) {
      console.error(err);
      showToast('Comment reaction failed');
    }
  };

  const handleSuggestedVideoClick = (suggestedVideoId) => {
    navigate(`/watch/${suggestedVideoId}`);
  };

  return (
    <div className="video-player-page">
      <div className="video-player-main">
        <div className="video-player-container">
          {isFileVideo(playerSource) ? (
            <video
              className="video-player"
              src={playerSource}
              controls
              playsInline
            />
          ) : (
            <iframe
              className="video-player"
              src={playerSource}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <div className="video-title-section">
          <h1 className="video-title">{video.title}</h1>
          <div className="video-metadata-row">
            <div className="video-stats">
              {formatViewCount(viewCount)} views • {formatTimeAgo(uploadDate)}
            </div>
            <div className="video-actions">
              <button
                className={`action-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <ThumbsUp size={20} />
                <span>{formatViewCount(likeCount)}</span>
              </button>
              <button
                className={`action-button ${isDisliked ? 'liked' : ''}`}
                onClick={handleDislike}
              >
                <ThumbsDown size={20} />
              </button>
              <button className="action-button" onClick={handleShare}>
                <Share2 size={20} />
                <span>Share</span>
              </button>
              <button className="action-button" onClick={handleDownload}>
                <Download size={20} />
                <span>Open</span>
              </button>
              <button className="action-button" onClick={handleSave}>
                <ListPlus size={20} />
                <span>Save</span>
              </button>
              <button className="action-button" onClick={handleMiniPlayer}>
                <Minimize2 size={20} />
                <span>Miniplayer</span>
              </button>
              <button
                className="action-button"
                onClick={() => showToast('More actions are not implemented yet.')}
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="channel-info-section">
          <div className="channel-info-left">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="channel-avatar-large"
              onClick={() => navigate(`/channel/${channel.channelId}`)}
            />
            <div className="channel-details" onClick={() => navigate(`/channel/${channel.channelId}`)}>
              <div className="channel-name">{channel.name}</div>
              <div className="channel-subscribers">
                {formatViewCount(channel.subscriberCount)} subscribers
              </div>
            </div>
          </div>
          <div className="subscribe-section">
            <button
              className={`subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
              onClick={handleSubscribe}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
            {isSubscribed && (
              <button
                className="notification-bell-button"
                aria-label="Notifications"
                onClick={() => showToast('Notification settings are not implemented yet.')}
              >
                <Bell size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="video-description-section">
          <div className={`description-text ${!descriptionExpanded ? 'collapsed' : ''}`}>
            {video.description}
          </div>
          <button
            className="show-more-button"
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
          >
            {descriptionExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>

        <div className="comments-section">
          <div className="comments-header">
            <div className="comments-count">{comments.length} Comments</div>
            <div className="comments-sort">
              <ChevronDown size={20} />
              <span>Top comments</span>
            </div>
          </div>

          <div className="add-comment">
            <img src={data.user.avatar} alt={data.user.displayName} className="comment-avatar" />
            <div className="comment-input-container">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => setShowCommentActions(true)}
              />
              {showCommentActions && (
                <div className="comment-actions">
                  <button
                    className="comment-cancel"
                    onClick={() => {
                      setCommentText('');
                      setShowCommentActions(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="comment-submit"
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim()}
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.commentId}>
                <div className="comment-item">
                  <img src={comment.userAvatar} alt={comment.userName} className="comment-avatar" />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.userName}</span>
                      <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <div className="comment-text">{comment.text}</div>
                    <div className="comment-actions-row">
                      <button
                        className={`comment-action ${commentReactions[comment.commentId] === 'like' ? 'liked' : ''}`}
                        onClick={() => handleCommentReaction(comment.commentId, 'like')}
                      >
                        <ThumbsUp size={16} />
                        <span className="comment-like-count">
                          {comment.likeCount}
                        </span>
                      </button>
                      <button
                        className={`comment-action ${commentReactions[comment.commentId] === 'dislike' ? 'liked' : ''}`}
                        onClick={() => handleCommentReaction(comment.commentId, 'dislike')}
                      >
                        <ThumbsDown size={16} />
                      </button>
                      <button
                        className="comment-action"
                        onClick={() => setReplyingTo(comment.commentId)}
                      >
                        <span>Reply</span>
                      </button>
                    </div>
                    {replyingTo === comment.commentId && (
                      <div className="reply-input-section">
                        <img src={data.user.avatar} alt={data.user.displayName} className="comment-avatar" />
                        <div className="reply-input-container">
                          <input
                            type="text"
                            className="comment-input"
                            placeholder="Add a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            autoFocus
                          />
                          <div className="comment-actions">
                            <button
                              className="comment-cancel"
                              onClick={() => {
                                setReplyText('');
                                setReplyingTo(null);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="comment-submit"
                              onClick={() => handleReplySubmit(comment.commentId)}
                              disabled={!replyText.trim()}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.commentId} className="comment-item">
                            <img src={reply.userAvatar} alt={reply.userName} className="comment-avatar" />
                            <div className="comment-content">
                              <div className="comment-header">
                                <span className="comment-author">{reply.userName}</span>
                                <span className="comment-time">{formatTimeAgo(reply.timestamp)}</span>
                              </div>
                              <div className="comment-text">{reply.text}</div>
                              <div className="comment-actions-row">
                                <button
                                  className={`comment-action ${commentReactions[reply.commentId] === 'like' ? 'liked' : ''}`}
                                  onClick={() => handleCommentReaction(reply.commentId, 'like')}
                                >
                                  <ThumbsUp size={16} />
                                  <span className="comment-like-count">
                                    {reply.likeCount}
                                  </span>
                                </button>
                                <button
                                  className={`comment-action ${commentReactions[reply.commentId] === 'dislike' ? 'liked' : ''}`}
                                  onClick={() => handleCommentReaction(reply.commentId, 'dislike')}
                                >
                                  <ThumbsDown size={16} />
                                </button>
                                <button
                                  className="comment-action"
                                  onClick={() => showToast('Replying to replies is not implemented yet.')}
                                >
                                  <span>Reply</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="video-player-sidebar">
        <div className="suggested-videos">
          {suggestedVideos.map(suggestedVideo => (
            <div
              key={suggestedVideo.videoId}
              className="suggested-video-item"
              onClick={() => handleSuggestedVideoClick(suggestedVideo.videoId)}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={suggestedVideo.thumbnail}
                  alt={suggestedVideo.title}
                  className="suggested-thumbnail"
                />
                <span className="video-duration" style={{ position: 'absolute', bottom: '4px', right: '4px' }}>
                  {suggestedVideo.duration}
                </span>
              </div>
              <div className="suggested-info">
                <div className="suggested-title">{suggestedVideo.title}</div>
                <div className="suggested-channel">{suggestedVideo.channelName}</div>
                <div className="suggested-stats">
                  {formatViewCount(suggestedVideo.viewCount)} views • {formatTimeAgo(suggestedVideo.uploadDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoId={videoId}
      />

      <PlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoPlayerPage;
