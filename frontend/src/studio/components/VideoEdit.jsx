import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  formatDuration,
  getVideoId,
  getVideoLikes,
  getVideoViews,
  parseDurationToSeconds,
} from '../utils/metrics';

function ClipsTab({ onNotImplemented }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d0d0d] mb-2">Clips</h1>
        <p className="text-sm text-[#606060]">Create and manage video clips</p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-8">
        <div className="text-center max-w-md mx-auto">
          <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 fill-[#606060]">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path>
          </svg>
          <h2 className="text-xl font-medium text-[#0d0d0d] mb-2">Create video clips</h2>
          <p className="text-sm text-[#606060] mb-6">
            Make clips from your existing videos to share highlights or create compilations.
          </p>
          <button
            className="px-6 py-3 bg-[#065fd4] text-white rounded hover:bg-[#0450b4] text-sm font-medium"
            onClick={() => onNotImplemented?.('Video clips')}
          >
            Create video clip
          </button>
          <div className="mt-6">
            <a
              href="#"
              className="text-sm text-[#065fd4] hover:text-[#0450b4]"
              onClick={(event) => {
                event.preventDefault();
                onNotImplemented?.('Video clips');
              }}
            >
              Learn more about video clips
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyrightTab() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d0d0d] mb-2">Copyright</h1>
        <p className="text-sm text-[#606060]">Manage copyright and content ID status</p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-green-600">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">No copyright issues</h2>
            <p className="text-sm text-[#606060]">
              Your video doesn't have any copyright claims or Content ID matches.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6 mb-6">
        <h3 className="text-base font-medium text-[#0d0d0d] mb-4">Channel impact</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#606060]">Copyright strikes</span>
            <span className="text-sm font-medium text-[#0d0d0d]">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#606060]">Content ID claims</span>
            <span className="text-sm font-medium text-[#0d0d0d]">0</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6 mb-6">
        <h3 className="text-base font-medium text-[#0d0d0d] mb-4">Visibility restrictions</h3>
        <div className="flex items-center gap-3 p-4 bg-[#f9f9f9] rounded">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060] flex-shrink-0">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
          </svg>
          <div className="flex-1">
            <p className="text-sm text-[#0d0d0d] font-medium">No restrictions</p>
            <p className="text-xs text-[#606060]">Your video is visible worldwide</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h3 className="text-base font-medium text-[#0d0d0d] mb-4">Content used</h3>
        <div className="text-center py-8">
          <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-3 fill-[#606060]">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
          </svg>
          <p className="text-sm text-[#606060]">No copyrighted content detected in this video</p>
        </div>
      </div>
    </div>
  );
}

function EditorTab({ onNotImplemented, onTrimAndCut }) {
  const editingOptions = [
    {
      id: 'trim',
      title: 'Trim & cut',
      description: 'Remove parts from your video',
      icon: 'M9 3L5 6.99h3V14h2V6.99h3L9 3zM16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z'
    },
    {
      id: 'blur',
      title: 'Blur',
      description: 'Blur faces or objects in your video',
      icon: 'M14 10H2.5A2.5 2.5 0 0 0 0 12.5v7A2.5 2.5 0 0 0 2.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 14 10zM8 17.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'
    },
    {
      id: 'audio',
      title: 'Audio',
      description: 'Add or replace audio tracks',
      icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'
    },
    {
      id: 'endscreen',
      title: 'End screen',
      description: 'Promote other videos at the end',
      icon: 'M18 4l2 3h-3l-2-3h-2l2 3h-3l-2-3H8l2 3H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z'
    },
    {
      id: 'infocards',
      title: 'Info cards',
      description: 'Add interactive cards to your video',
      icon: 'M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d0d0d] mb-2">Video editor</h1>
        <p className="text-sm text-[#606060]">Edit and enhance your video</p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6 mb-6">
        <div className="aspect-video bg-[#000000] rounded mb-4 flex items-center justify-center">
          <div className="text-center text-white">
            <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-2 fill-white">
              <path d="M8 5v14l11-7z"></path>
            </svg>
            <p className="text-sm">Video Player</p>
          </div>
        </div>

        <div className="bg-[#f9f9f9] rounded p-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs text-[#606060] font-medium">Timeline</span>
            <button
              className="px-3 py-1 bg-white border border-[#e5e5e5] rounded text-xs hover:bg-[#f9f9f9]"
              onClick={() => onNotImplemented?.('Timeline zoom')}
            >
              Zoom in
            </button>
            <button
              className="px-3 py-1 bg-white border border-[#e5e5e5] rounded text-xs hover:bg-[#f9f9f9]"
              onClick={() => onNotImplemented?.('Timeline zoom')}
            >
              Zoom out
            </button>
          </div>
          <div className="h-16 bg-gradient-to-r from-[#065fd4] to-[#4285f4] rounded flex items-center justify-center">
            <span className="text-white text-sm">00:00 - 05:23</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md p-6">
        <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Edit</h2>
        <div className="space-y-3">
          {editingOptions.map((option) => (
            <button
              key={option.id}
              className="w-full flex items-start gap-4 p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] transition-colors text-left"
              onClick={() => option.id === 'trim' && onTrimAndCut ? onTrimAndCut() : onNotImplemented?.(option.title)}
            >
              <div className="w-10 h-10 bg-[#f2f2f2] rounded-full flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d={option.icon}></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#0d0d0d] mb-1">{option.title}</h3>
                <p className="text-xs text-[#606060]">{option.description}</p>
              </div>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060] flex-shrink-0">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsTab({ videoId, onNotImplemented }) {
  const { data, addComment, toggleCommentLike, toggleCommentDislike, toggleCommentHeart, removeComment, hideUser, addModerator, reportComment, showToast } = useData();
  const [filterStatus, setFilterStatus] = useState('published');
  const [sortBy, setSortBy] = useState('recent');
  const [responseStatus, setResponseStatus] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingComment, setReportingComment] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showReportResult, setShowReportResult] = useState(false);
  const [hideUserOnReport, setHideUserOnReport] = useState(false);

  const reportReasons = [
    { value: 'spam', label: 'Unwanted commercial content or spam' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'hate_speech', label: 'Hate speech or symbols' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'privacy', label: 'Privacy violation' },
    { value: 'impersonation', label: 'Impersonation' },
    { value: 'violence', label: 'Violence or dangerous activities' },
    { value: 'child_safety', label: 'Child safety' },
    { value: 'other', label: 'Other' },
  ];

  const commentReactions = data?.user?.commentReactions || {};

  const comments = useMemo(() => {
    const userId = data?.user?.userId;
    return (data?.comments?.[videoId] || []).map((comment) => {
      const replies = comment.replies || [];
      const responded = userId ? replies.some((reply) => reply.userId === userId) : replies.length > 0;
      return {
        ...comment,
        status: comment.status || 'published',
        replies,
        responded,
      };
    });
  }, [data, videoId]);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      if (filterStatus !== 'all' && comment.status !== filterStatus) return false;
      if (responseStatus === 'responded' && !comment.responded) return false;
      if (responseStatus === 'unresponded' && comment.responded) return false;
      return true;
    });
  }, [comments, filterStatus, responseStatus]);

  const sortedComments = useMemo(() => {
    const sorted = [...filteredComments];
    if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));
    } else {
      sorted.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    }
    return sorted;
  }, [filteredComments, sortBy]);

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      await addComment(videoId, replyText, commentId);
      setReplyText('');
      setReplyingTo(null);
      showToast('Reply added');
    } catch (err) {
      console.error(err);
      showToast('Failed to reply');
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      if (type === 'like') {
        await toggleCommentLike(commentId);
      } else if (type === 'dislike') {
        await toggleCommentDislike(commentId);
      } else if (type === 'heart') {
        await toggleCommentHeart(commentId);
      }
    } catch (err) {
      console.error(err);
      showToast('Action failed');
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleRemoveComment = async (commentId) => {
    try {
      await removeComment(commentId);
      showToast('Comment removed');
      setShowActionMenu(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to remove comment');
    }
  };

  const handleHideUser = async (comment) => {
    try {
      await hideUser(comment.userId, comment.userName, comment.userAvatar);
      showToast(`${comment.userName} has been hidden from your channel`);
      setShowActionMenu(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to hide user');
    }
  };

  const handleAddModerator = async (comment, type) => {
    try {
      await addModerator(comment.userId, comment.userName, comment.userAvatar, type);
      showToast(`${comment.userName} added as ${type} moderator`);
      setShowActionMenu(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to add moderator');
    }
  };

  const handleOpenReportModal = (comment) => {
    setReportingComment(comment);
    setReportReason('');
    setReportDetails('');
    setShowReportModal(true);
    setShowActionMenu(null);
  };

  const handleSubmitReport = async () => {
    if (!reportReason || !reportingComment) return;
    try {
      await reportComment(reportingComment.commentId, reportReason, reportDetails);
      setShowReportModal(false);
      setShowReportResult(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to submit report');
    }
  };

  const handleCloseReportResult = async () => {
    if (hideUserOnReport && reportingComment) {
      try {
        await hideUser(reportingComment.userId, reportingComment.userName, reportingComment.userAvatar);
        showToast(`${reportingComment.userName} has been hidden from your channel`);
      } catch (err) {
        console.error(err);
        showToast('Failed to hide user');
      }
    }
    setShowReportResult(false);
    setReportingComment(null);
    setHideUserOnReport(false);
  };

  const renderActionMenu = (comment) => (
    <div className="relative">
      <button
        onClick={() => setShowActionMenu(showActionMenu === comment.commentId ? null : comment.commentId)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {showActionMenu === comment.commentId && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
          <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-gray-200 rounded shadow-lg z-20">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => handleRemoveComment(comment.commentId)}
            >
              Remove
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => handleOpenReportModal(comment)}
            >
              Report spam or abuse
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => handleHideUser(comment)}
            >
              Hide user from channel
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => onNotImplemented?.('Always approve')}
            >
              Always approve comments from this user
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => handleAddModerator(comment, 'managing')}
            >
              Add user as managing moderator
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => handleAddModerator(comment, 'standard')}
            >
              Add user as standard moderator
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d0d0d] mb-2">Comments</h1>
        <p className="text-sm text-[#606060]">Manage and moderate video comments</p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md mb-6 p-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-xs text-[#606060] mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#065fd4]"
            >
              <option value="published">Published</option>
              <option value="held">Held for review</option>
              <option value="all">All</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#606060] mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#065fd4]"
            >
              <option value="recent">Most recent</option>
              <option value="popular">Most popular</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#606060] mb-2">Response status</label>
            <select
              value={responseStatus}
              onChange={(e) => setResponseStatus(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#065fd4]"
            >
              <option value="all">All comments</option>
              <option value="responded">Responded</option>
              <option value="unresponded">Not responded</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md">
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => {
            const liked = commentReactions[comment.commentId] === 'like';
            const disliked = commentReactions[comment.commentId] === 'dislike';
            return (
              <div key={comment.commentId} className="p-4 border-b border-[#e5e5e5] last:border-b-0">
                <div className="flex gap-3">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[#0d0d0d]">{comment.userName}</span>
                      <span className="text-xs text-[#606060]">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#0d0d0d] mb-3">{comment.text}</p>

                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#0d0d0d]"
                        onClick={() => setReplyingTo(comment.commentId)}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                        </svg>
                        Reply
                      </button>
                      <button
                        className={`flex items-center gap-1 text-xs hover:text-[#0d0d0d] ${liked ? 'text-[#065fd4]' : 'text-[#606060]'}`}
                        onClick={() => handleReaction(comment.commentId, 'like')}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                        </svg>
                        Like ({comment.likeCount || 0})
                      </button>
                      <button
                        className={`flex items-center gap-1 text-xs hover:text-[#0d0d0d] ${disliked ? 'text-[#0d0d0d]' : 'text-[#606060]'}`}
                        onClick={() => handleReaction(comment.commentId, 'dislike')}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                        </svg>
                        Dislike
                      </button>
                      <button
                        className={`flex items-center gap-1 text-xs hover:text-[#0d0d0d] ${comment.isHearted ? 'text-[#e91e63]' : 'text-[#606060]'}`}
                        onClick={() => handleReaction(comment.commentId, 'heart')}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                        </svg>
                        Heart
                      </button>
                      {renderActionMenu(comment)}
                    </div>

                    {replyingTo === comment.commentId && (
                      <div className="mt-3">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-[#e5e5e5] rounded text-sm"
                          placeholder="Add a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-3 py-1 text-sm text-[#606060] hover:text-[#0d0d0d]"
                            onClick={() => {
                              setReplyText('');
                              setReplyingTo(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-3 py-1 text-sm text-white bg-[#065fd4] rounded hover:bg-[#0450b4]"
                            onClick={() => handleReplySubmit(comment.commentId)}
                            disabled={!replyText.trim()}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {comment.replies.length > 0 && (
                      <div className="mt-3">
                        <button
                          className="text-xs text-[#065fd4] cursor-pointer hover:text-[#0450b4]"
                          onClick={() => toggleReplies(comment.commentId)}
                        >
                          {expandedReplies.has(comment.commentId) ? 'Hide' : 'View'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                        {expandedReplies.has(comment.commentId) && (
                          <div className="mt-3 space-y-3">
                            {comment.replies.map((reply) => {
                              const replyLiked = commentReactions[reply.commentId] === 'like';
                              const replyDisliked = commentReactions[reply.commentId] === 'dislike';
                              return (
                                <div key={reply.commentId} className="flex gap-3">
                                  <img
                                    src={reply.userAvatar}
                                    alt={reply.userName}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium">{reply.userName}</span>
                                      <span className="text-xs text-[#606060]">{reply.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-[#0d0d0d] mb-2">{reply.text}</p>
                                    <div className="flex items-center gap-3">
                                      <button
                                        className={`flex items-center gap-1 text-xs hover:text-[#0d0d0d] ${replyLiked ? 'text-[#065fd4]' : 'text-[#606060]'}`}
                                        onClick={() => handleReaction(reply.commentId, 'like')}
                                      >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                                        </svg>
                                        {reply.likeCount || 0}
                                      </button>
                                      <button
                                        className={`flex items-center gap-1 text-xs hover:text-[#0d0d0d] ${replyDisliked ? 'text-[#0d0d0d]' : 'text-[#606060]'}`}
                                        onClick={() => handleReaction(reply.commentId, 'dislike')}
                                      >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                          <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                                        </svg>
                                      </button>
                                      <button
                                        className={`flex items-center gap-1 text-xs hover:text-[#0d0d0d] ${reply.isHearted ? 'text-[#e91e63]' : 'text-[#606060]'}`}
                                        onClick={() => handleReaction(reply.commentId, 'heart')}
                                      >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                                        </svg>
                                      </button>
                                      {renderActionMenu(reply)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-sm text-[#606060]">No comments yet.</div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowReportModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Report comment</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {reportingComment && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={reportingComment.userAvatar}
                        alt={reportingComment.userName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium">{reportingComment.userName}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{reportingComment.text}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Why are you reporting this comment?
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reportReasons.map((reason) => (
                      <label key={reason.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="reportReason"
                          value={reason.value}
                          checked={reportReason === reason.value}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{reason.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any additional context..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={!reportReason}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Result Modal */}
      {showReportResult && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCloseReportResult} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2 text-center">Thanks for reporting</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">
                This comment is no longer visible to anyone other than the commenter.
              </p>

              {/* Hide user checkbox */}
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideUserOnReport}
                    onChange={(e) => setHideUserOnReport(e.target.checked)}
                    className="w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Hide user on my channel</span>
                    <p className="text-xs text-gray-500 mt-0.5">Comments they leave will be visible only to them</p>
                  </div>
                </label>
              </div>

              <button
                onClick={handleCloseReportResult}
                className="w-full px-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticsTab({ videoId }) {
  const { data } = useData();
  const [analyticsTab, setAnalyticsTab] = useState('overview');

  const analyticsTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reach', label: 'Reach' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'audience', label: 'Audience' }
  ];

  const video = useMemo(() => {
    return (data?.videos || []).find((item) => getVideoId(item) === videoId) || {};
  }, [data, videoId]);

  const viewCount = getVideoViews(video);
  const likeCount = getVideoLikes(video);
  const commentCount = (data?.comments?.[videoId] || []).length;
  const durationSeconds = parseDurationToSeconds(video?.duration);
  const watchTimeHours = durationSeconds ? (viewCount * durationSeconds) / 3600 : 0;
  const avgViewDuration = durationSeconds ? formatDuration(durationSeconds) : '0:00';
  const retention = viewCount ? `${Math.min(100, Math.round((likeCount / Math.max(1, viewCount)) * 100))}%` : '0%';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d0d0d] mb-2">Video analytics</h1>
        <p className="text-sm text-[#606060]">Track your video's performance</p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-md mb-6">
        <div className="flex border-b border-[#e5e5e5]">
          {analyticsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAnalyticsTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                analyticsTab === tab.id
                  ? 'text-[#065fd4] border-b-2 border-[#065fd4]'
                  : 'text-[#606060] hover:text-[#0d0d0d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {analyticsTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-[#f9f9f9] rounded">
                <div className="text-sm text-[#606060] mb-1">Views</div>
                <div className="text-2xl font-bold text-[#0d0d0d]">{viewCount.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-[#f9f9f9] rounded">
                <div className="text-sm text-[#606060] mb-1">Watch time (hours)</div>
                <div className="text-2xl font-bold text-[#0d0d0d]">{watchTimeHours.toFixed(1)}</div>
              </div>
              <div className="p-4 bg-[#f9f9f9] rounded">
                <div className="text-sm text-[#606060] mb-1">Average view duration</div>
                <div className="text-2xl font-bold text-[#0d0d0d]">{avgViewDuration}</div>
              </div>
            </div>

            <div className="border border-[#e5e5e5] rounded p-6 mb-6">
              <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Audience retention</h3>
              <div className="h-64 bg-gradient-to-r from-[#065fd4] to-[#4285f4] opacity-10 rounded flex items-center justify-center">
                <div className="text-center">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-2 fill-[#606060]">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path>
                  </svg>
                  <p className="text-[#606060] text-sm">Estimated retention: {retention}</p>
                </div>
              </div>
            </div>

            <div className="border border-[#e5e5e5] rounded p-6">
              <h3 className="text-lg font-medium text-[#0d0d0d] mb-2">Realtime views</h3>
              <p className="text-sm text-[#606060] mb-4">Last 60 minutes</p>
              <div className="text-3xl font-bold text-[#065fd4]">
                {Math.max(0, Math.round(viewCount * 0.02))}
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'reach' && (
          <div className="p-6">
            <div className="text-center py-12">
              <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 fill-[#606060]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
              </svg>
              <h3 className="text-lg font-medium text-[#0d0d0d] mb-2">Reach metrics</h3>
              <p className="text-[#606060] text-sm">Impressions and traffic sources need more data.</p>
            </div>
          </div>
        )}

        {analyticsTab === 'engagement' && (
          <div className="p-6">
            <div className="text-center py-12">
              <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 fill-[#606060]">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"></path>
              </svg>
              <h3 className="text-lg font-medium text-[#0d0d0d] mb-2">Engagement metrics</h3>
              <p className="text-[#606060] text-sm">Likes: {likeCount.toLocaleString()} · Comments: {commentCount.toLocaleString()}</p>
            </div>
          </div>
        )}

        {analyticsTab === 'audience' && (
          <div className="p-6">
            <div className="text-center py-12">
              <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 fill-[#606060]">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
              </svg>
              <h3 className="text-lg font-medium text-[#0d0d0d] mb-2">Audience insights</h3>
              <p className="text-[#606060] text-sm">Audience demographics need more data.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoEdit({ video, onBack, initialTab = 'details', onNotImplemented }) {
  const { updateVideoDetails, showToast } = useData();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hasChanges, setHasChanges] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [formData, setFormData] = useState({
    title: video?.title || 'Untitled Video',
    description: video?.description || '',
    visibility: video?.visibility || 'Public'
  });

  // Handler for uploading thumbnail
  const handleThumbnailUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        showToast(`Thumbnail "${file.name}" uploaded successfully`);
      }
    };
    input.click();
  };

  // Handler for subtitles
  const handleSubtitles = () => {
    showToast('Subtitles editor opened - you can add or edit subtitles');
  };

  // Handler for trim & cut
  const handleTrimAndCut = () => {
    showToast('Video trimming tool opened - use timeline to trim video sections');
  };

  useEffect(() => {
    setFormData({
      title: video?.title || 'Untitled Video',
      description: video?.description || '',
      visibility: video?.visibility || 'Public',
    });
    setHasChanges(false);
  }, [video]);

  const tabs = [
    { id: 'details', label: 'Details', icon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
    { id: 'analytics', label: 'Analytics', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
    { id: 'editor', label: 'Editor', icon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
    { id: 'comments', label: 'Comments', icon: 'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z' },
    { id: 'copyright', label: 'Copyright', icon: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' },
    { id: 'clips', label: 'Clips', icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z' }
  ];

  const videoId = getVideoId(video);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!videoId) return;
    try {
      await updateVideoDetails(videoId, {
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
      });
      setHasChanges(false);
      showToast('Video details updated');
    } catch (err) {
      console.error(err);
      showToast('Failed to update video');
    }
  };

  const handleUndo = () => {
    setFormData({
      title: video?.title || 'Untitled Video',
      description: video?.description || '',
      visibility: video?.visibility || 'Public',
    });
    setHasChanges(false);
  };

  if (!video) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#606060]">Video not found.</p>
        <button
          className="text-[#065fd4] text-sm mt-4"
          onClick={onBack}
        >
          Back to Content
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen pt-16">
      <div className="w-64 bg-white border-r border-[#e5e5e5] fixed left-64 top-16 bottom-0 overflow-y-auto">
        <div className="p-4 border-b border-[#e5e5e5]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#065fd4] hover:text-[#0450b4] text-sm font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
            </svg>
            Back to Content
          </button>
        </div>
        <div className="flex flex-col py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-[#f2f2f2] transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#f9f9f9] border-l-4 border-[#065fd4] text-[#065fd4]'
                  : 'text-[#606060] border-l-4 border-transparent'
              }`}
            >
              <svg viewBox="0 0 24 24" className={`w-5 h-5 ${activeTab === tab.id ? 'fill-[#065fd4]' : 'fill-[#606060]'}`}>
                <path d={tab.icon}></path>
              </svg>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6 max-w-[1280px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0d0d0d] mb-2">Video details</h1>
            <p className="text-sm text-[#606060]">Edit your video information</p>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#e5e5e5] rounded-md overflow-hidden">
                <div className="relative bg-black aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-2 fill-white/70">
                        <path d="M10 16.5l6-4.5-6-4.5v9zM5 20h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zM5 5h14v14H5V5z"></path>
                      </svg>
                      <p className="text-white/70 text-sm">Video preview</p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-4">
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black transition-colors"
                        title="Play"
                        onClick={() => onNotImplemented?.('Video preview')}
                      >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                          <path d="M8 5v14l11-7z"></path>
                        </svg>
                      </button>

                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-white text-xs font-medium">0:00</span>
                        <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-red-600 rounded-full"></div>
                        </div>
                        <span className="text-white text-xs font-medium">0:00</span>
                      </div>

                      <button
                        className="text-white hover:text-white/80 transition-colors"
                        title="Volume"
                        onClick={() => onNotImplemented?.('Volume control')}
                      >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                        </svg>
                      </button>

                      <button
                        className="text-white hover:text-white/80 transition-colors"
                        title="Fullscreen"
                        onClick={() => onNotImplemented?.('Fullscreen')}
                      >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-md p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Title (required)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded focus:outline-none focus:border-[#065fd4] text-sm"
                  placeholder="Add a title that describes your video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded focus:outline-none focus:border-[#065fd4] text-sm resize-none"
                  placeholder="Tell viewers about your video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Thumbnail
                </label>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0450b4] text-sm font-medium"
                    onClick={handleThumbnailUpload}
                  >
                    Upload file
                  </button>
                  <button
                    className="px-4 py-2 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] text-sm font-medium"
                    onClick={() => onNotImplemented?.('Auto-generated thumbnails')}
                  >
                    Auto-generated
                  </button>
                  <button
                    className="px-4 py-2 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] text-sm font-medium"
                    onClick={() => onNotImplemented?.('Thumbnail testing')}
                  >
                    Test & compare
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Playlist
                </label>
                <select
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded focus:outline-none focus:border-[#065fd4] text-sm"
                  onChange={() => onNotImplemented?.('Playlist assignment')}
                >
                  <option>Select playlist</option>
                  <option>My Playlist 1</option>
                  <option>My Playlist 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Audience
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="audience" value="no" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">No, it's not made for kids</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="audience" value="yes" className="w-4 h-4" />
                    <span className="text-sm">Yes, it's made for kids</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Visibility
                </label>
                <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9]">
                  <div>
                    <div className="text-sm font-medium text-[#0d0d0d] mb-1">
                      {formData.visibility}
                    </div>
                    <div className="text-xs text-[#606060]">
                      {formData.visibility === 'Public' && 'Everyone can watch your video'}
                      {formData.visibility === 'Private' && 'Only you and people you choose can watch your video'}
                      {formData.visibility === 'Unlisted' && 'Anyone with the video link can watch your video'}
                      {formData.visibility === 'Scheduled' && 'Your video will go public at a scheduled time'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVisibilityModal(true)}
                    className="px-4 py-2 text-sm font-medium text-[#065fd4] hover:bg-[#e8f0fe] rounded transition-colors"
                  >
                    Edit video visibility status
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Video enhancements
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex items-center gap-3 p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] transition-colors"
                    onClick={handleSubtitles}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"></path>
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[#0d0d0d]">Subtitles</div>
                      <div className="text-xs text-[#606060]">Add or edit subtitles</div>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-3 p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] transition-colors"
                    onClick={() => onNotImplemented?.('End screen')}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                      <path d="M18 4l2 3h-3l-2-3h-2l2 3h-3l-2-3H8l2 3H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"></path>
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[#0d0d0d]">End screen</div>
                      <div className="text-xs text-[#606060]">Add elements to video end</div>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-3 p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] transition-colors"
                    onClick={() => onNotImplemented?.('Cards')}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"></path>
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[#0d0d0d]">Cards</div>
                      <div className="text-xs text-[#606060]">Add interactive cards</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      const link = video?.watchUrl || (videoId ? `https://youtube.com/watch?v=${videoId}` : '');
                      if (!link) {
                        onNotImplemented?.('Copy video link');
                        return;
                      }
                      navigator.clipboard.writeText(link);
                      showToast('Video link copied to clipboard');
                    }}
                    className="flex items-center gap-3 p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[#0d0d0d]">Copy video link</div>
                      <div className="text-xs text-[#606060]">Share your video</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e5e5e5] flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                    hasChanges
                      ? 'bg-[#065fd4] text-white hover:bg-[#0450b4] cursor-pointer'
                      : 'bg-[#e5e5e5] text-[#909090] cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={handleUndo}
                  disabled={!hasChanges}
                  className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                    hasChanges
                      ? 'border border-[#e5e5e5] hover:bg-[#f9f9f9] cursor-pointer'
                      : 'border border-[#e5e5e5] text-[#909090] cursor-not-allowed'
                  }`}
                >
                  Undo changes
                </button>
              </div>
            </div>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsTab videoId={videoId} />}

          {activeTab === 'editor' && <EditorTab onNotImplemented={onNotImplemented} onTrimAndCut={handleTrimAndCut} />}

          {activeTab === 'comments' && <CommentsTab videoId={videoId} onNotImplemented={onNotImplemented} />}

          {activeTab === 'copyright' && <CopyrightTab />}

          {activeTab === 'clips' && <ClipsTab onNotImplemented={onNotImplemented} />}

          {activeTab !== 'details' && activeTab !== 'analytics' && activeTab !== 'editor' && activeTab !== 'comments' && activeTab !== 'copyright' && activeTab !== 'clips' && (
            <div className="bg-white border border-[#e5e5e5] rounded-md p-8 text-center">
              <h2 className="text-xl font-medium text-[#0d0d0d] mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-[#606060]">This section is coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {showVisibilityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVisibilityModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-[#0d0d0d]">Video visibility</h2>
                <button onClick={() => setShowVisibilityModal(false)} className="text-[#606060] hover:text-[#0d0d0d]">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {['Public', 'Private', 'Unlisted', 'Scheduled'].map((visibility) => (
                <label key={visibility} className="flex items-start gap-4 p-4 border border-[#e5e5e5] rounded hover:bg-[#f9f9f9] cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={visibility}
                    checked={formData.visibility === visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="mt-1 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#0d0d0d] mb-1">{visibility}</div>
                    <div className="text-xs text-[#606060]">
                      {visibility === 'Public' && 'Everyone can watch your video'}
                      {visibility === 'Private' && 'Only you and people you choose can watch your video'}
                      {visibility === 'Unlisted' && 'Anyone with the video link can watch your video'}
                      {visibility === 'Scheduled' && 'Your video will go public at a scheduled time'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="border-t border-[#e5e5e5] p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowVisibilityModal(false)}
                className="px-6 py-2 text-sm font-medium text-[#065fd4] hover:bg-[#e8f0fe] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowVisibilityModal(false)}
                className="px-6 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0450b4] text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
