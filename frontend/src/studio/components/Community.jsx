import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { buildVideoLookup, flattenComments } from '../utils/metrics';

export default function Community({ videos = [], onNotImplemented }) {
  const { data, addComment, toggleCommentLike, toggleCommentDislike, toggleCommentHeart, removeComment, hideUser, addModerator, reportComment, showToast } = useData();

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingComment, setReportingComment] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showReportResult, setShowReportResult] = useState(false);
  const [hideUserOnReport, setHideUserOnReport] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('comments'); // comments, viewer-posts, mentions

  // Filter state
  const [moderationStatus, setModerationStatus] = useState('published'); // published, held
  const [sortBy, setSortBy] = useState('most-relevant'); // most-relevant, newest
  const [responseStatus, setResponseStatus] = useState(['unresponded', 'responded']); // unresponded, responded, new-replies
  const [filterText, setFilterText] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedComments, setSelectedComments] = useState(new Set());

  // Dropdown state
  const [showModerationDropdown, setShowModerationDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showResponseFilter, setShowResponseFilter] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const videoLookup = useMemo(() => buildVideoLookup(videos), [videos]);

  const allComments = useMemo(() => {
    const userId = data?.user?.userId;
    const allowedVideoIds = new Set(Object.keys(videoLookup));
    return flattenComments(data?.comments || {})
      .filter((comment) => allowedVideoIds.has(comment.videoId))
      .map((comment) => {
        const replies = comment.replies || [];
        const hasCreatorReply = userId
          ? replies.some((reply) => reply.userId === userId)
          : replies.length > 0;
        return {
          ...comment,
          status: comment.status || 'published',
          responded: hasCreatorReply,
          replies,
        };
      });
  }, [data, videoLookup]);

  const commentLookup = useMemo(() => {
    const map = new Map();
    allComments.forEach((comment) => {
      map.set(comment.commentId, comment);
    });
    return map;
  }, [allComments]);

  const reactionMap = data?.user?.commentReactions || {};

  // Filter comments based on current filters
  const filteredComments = useMemo(() => {
    return allComments.filter(comment => {
      if (comment.status !== moderationStatus) return false;

      if (responseStatus.length > 0) {
        const matchesResponse =
          (responseStatus.includes('unresponded') && !comment.responded) ||
          (responseStatus.includes('responded') && comment.responded) ||
          (responseStatus.includes('new-replies') && comment.replies.length > 0);
        if (!matchesResponse) return false;
      }

      if (filterText) {
        const searchText = filterText.toLowerCase();
        return comment.text.toLowerCase().includes(searchText) ||
               comment.userName?.toLowerCase().includes(searchText);
      }

      return true;
    });
  }, [allComments, moderationStatus, responseStatus, filterText]);

  // Sort comments
  const sortedComments = useMemo(() => {
    const sorted = [...filteredComments];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    } else {
      sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    }
    return sorted;
  }, [filteredComments, sortBy]);

  const handleSelectComment = (commentId) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(sortedComments.map(c => c.commentId)));
    }
    setSelectAll(!selectAll);
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    const parentComment = commentLookup.get(replyingTo);
    if (!parentComment) return;
    try {
      await addComment(parentComment.videoId, replyText, parentComment.commentId);
      setReplyText('');
      setReplyingTo(null);
      showToast('Reply added');
    } catch (err) {
      console.error(err);
      showToast('Failed to reply');
    }
  };

  const toggleReplies = (commentId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const handleReaction = async (commentId, reaction) => {
    try {
      if (reaction === 'like') {
        await toggleCommentLike(commentId);
      } else if (reaction === 'dislike') {
        await toggleCommentDislike(commentId);
      } else if (reaction === 'heart') {
        await toggleCommentHeart(commentId);
      }
    } catch (err) {
      console.error(err);
      showToast('Action failed');
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      await removeComment(commentId);
      showToast('Comment removed');
      setSelectedComments((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to remove comment');
    }
  };

  const handleBatchRemove = async () => {
    const ids = Array.from(selectedComments);
    for (const commentId of ids) {
      await handleRemoveComment(commentId);
    }
    setSelectedComments(new Set());
    setSelectAll(false);
  };

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
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

  const renderModerationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowModerationDropdown(!showModerationDropdown)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
      >
        <span className="text-sm">
          {moderationStatus === 'published' ? 'Published' : 'Held for review'}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showModerationDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowModerationDropdown(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded shadow-lg z-20">
            <div className="p-4">
              <div className="mb-3">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="moderation"
                    checked={moderationStatus === 'published'}
                    onChange={() => setModerationStatus('published')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="moderation"
                    checked={moderationStatus === 'held'}
                    onChange={() => setModerationStatus('held')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Held for review</span>
                </label>
              </div>
              <button
                onClick={() => setShowModerationDropdown(false)}
                className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSortDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
      >
        <span className="text-sm">
          Sort by: {sortBy === 'most-relevant' ? 'Most relevant (default)' : 'Newest'}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showSortDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded shadow-lg z-20">
            <div className="p-4">
              <div className="mb-3">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'most-relevant'}
                    onChange={() => setSortBy('most-relevant')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Most relevant (default)</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'newest'}
                    onChange={() => setSortBy('newest')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Newest</span>
                </label>
              </div>
              <button
                onClick={() => setShowSortDropdown(false)}
                className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderResponseFilter = () => (
    <div className="relative">
      <button
        onClick={() => setShowResponseFilter(!showResponseFilter)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
      >
        <span className="text-sm">Response status</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showResponseFilter && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowResponseFilter(false)} />
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded shadow-lg z-20">
            <div className="p-4">
              <div className="mb-3">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={responseStatus.includes('unresponded')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setResponseStatus([...responseStatus, 'unresponded']);
                      } else {
                        setResponseStatus(responseStatus.filter(s => s !== 'unresponded'));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Unresponded</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={responseStatus.includes('responded')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setResponseStatus([...responseStatus, 'responded']);
                      } else {
                        setResponseStatus(responseStatus.filter(s => s !== 'responded'));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Responded</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={responseStatus.includes('new-replies')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setResponseStatus([...responseStatus, 'new-replies']);
                      } else {
                        setResponseStatus(responseStatus.filter(s => s !== 'new-replies'));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">New replies to your response</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResponseFilter(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowResponseFilter(false)}
                  className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderActionMenu = (comment) => (
    <div className="relative">
      <button
        onClick={() => setShowActionMenu(showActionMenu === comment.commentId ? null : comment.commentId)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {showActionMenu === comment.commentId && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
          <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-gray-200 rounded shadow-lg z-20">
            <a
              href={`https://www.youtube.com/watch?v=${comment.youtubeId || comment.videoId}&lc=${comment.commentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => setShowActionMenu(null)}
            >
              View comment on StreamView
            </a>
            <div className="border-t border-gray-200 my-1" />
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
              onClick={() => handleNotImplemented('Always approve')}
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

  const renderReplyThread = (reply, depth = 0) => {
    const offset = depth > 0 ? { marginLeft: depth * 24 } : undefined;
    const liked = reactionMap[reply.commentId] === 'like';
    const disliked = reactionMap[reply.commentId] === 'dislike';
    return (
      <div key={reply.commentId} className="space-y-3">
        <div className="flex gap-3" style={offset}>
          <img
            src={reply.userAvatar}
            alt={reply.userName}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{reply.userName}</span>
              <span className="text-xs text-gray-500">{reply.timestamp}</span>
            </div>
            <p className="text-sm text-gray-900 mb-2">{reply.text}</p>
            <div className="flex items-center gap-3">
              <button
                className={`p-1 hover:bg-gray-100 rounded ${liked ? 'text-blue-600' : ''}`}
                onClick={() => handleReaction(reply.commentId, 'like')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <span className="text-xs text-gray-500">{reply.likeCount || 0}</span>
              <button
                className={`p-1 hover:bg-gray-100 rounded ${disliked ? 'text-gray-700' : ''}`}
                onClick={() => handleReaction(reply.commentId, 'dislike')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
              <button
                className={`p-1 hover:bg-gray-100 rounded ${reply.isHearted ? 'text-red-500' : ''}`}
                onClick={() => handleReaction(reply.commentId, 'heart')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
              {renderActionMenu(reply)}
            </div>
          </div>
        </div>
        {reply.replies?.length > 0 && (
          <div className="space-y-3">
            {reply.replies.map((child) => renderReplyThread(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderComment = (comment) => {
    const videoTitle = videoLookup[comment.videoId]?.title || 'Untitled video';
    const videoThumbnail = videoLookup[comment.videoId]?.thumbnail;
    const liked = reactionMap[comment.commentId] === 'like';
    const disliked = reactionMap[comment.commentId] === 'dislike';

    return (
      <div key={comment.commentId} className="border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <input
            type="checkbox"
            checked={selectedComments.has(comment.commentId)}
            onChange={() => handleSelectComment(comment.commentId)}
            className="mt-1 w-4 h-4"
          />

          <img
            src={comment.userAvatar}
            alt={comment.userName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
              <span className="text-xs text-gray-500">{comment.timestamp}</span>
            </div>

            <p className="text-sm text-gray-900 mb-2">{comment.text}</p>

            <div className="flex items-center gap-2 mb-3">
              {videoThumbnail && (
                <img
                  src={videoThumbnail}
                  alt={videoTitle}
                  className="w-20 h-11 object-cover rounded"
                />
              )}
              <span className="text-xs text-gray-600">On: {videoTitle}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleReply(comment.commentId)}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Reply
              </button>

              {comment.replies.length > 0 && (
                <button
                  onClick={() => toggleReplies(comment.commentId)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {expandedReplies.has(comment.commentId) ? 'Hide' : 'View'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}

              <button
                className={`p-1 hover:bg-gray-100 rounded ${liked ? 'text-blue-600' : ''}`}
                onClick={() => handleReaction(comment.commentId, 'like')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>

              <button
                className={`p-1 hover:bg-gray-100 rounded ${disliked ? 'text-gray-700' : ''}`}
                onClick={() => handleReaction(comment.commentId, 'dislike')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>

              <button
                className={`p-1 hover:bg-gray-100 rounded ${comment.isHearted ? 'text-red-500' : ''}`}
                onClick={() => handleReaction(comment.commentId, 'heart')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>

              {renderActionMenu(comment)}
            </div>

            {replyingTo === comment.commentId && (
              <div className="mt-4 ml-8">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCancelReply}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}

            {expandedReplies.has(comment.commentId) && comment.replies.length > 0 && (
              <div className="mt-4 ml-8 space-y-3">
                {comment.replies.map((reply) => renderReplyThread(reply, 0))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCommentsTab = () => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4"
          />
          <span className="text-sm">Select all</span>
        </label>

        {renderModerationDropdown()}
        {renderSortDropdown()}
        {renderResponseFilter()}

        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter comments..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      {selectedComments.size > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded">
          <span className="text-sm font-medium">{selectedComments.size} selected</span>
          <button
            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            onClick={() => handleNotImplemented('Approve comments')}
          >
            Approve
          </button>
          <button
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            onClick={handleBatchRemove}
          >
            Remove
          </button>
          <button
            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            onClick={() => handleNotImplemented('Report spam')}
          >
            Report spam
          </button>
        </div>
      )}

      {sortedComments.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded">
          {sortedComments.map(renderComment)}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded">
          <p className="text-gray-600">No comments found</p>
          <p className="text-sm text-gray-500 mt-2">Try searching for something else or removing filters</p>
        </div>
      )}
    </div>
  );

  const renderViewerPostsTab = () => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            <span className="text-sm">Published</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            <span className="text-sm">Sort by: Most recent</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Filter..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      <div className="text-center py-12 bg-white border border-gray-200 rounded">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">No viewer posts yet</h3>
        <p className="text-sm text-gray-500 mb-4">When viewers post on your channel, they'll appear here</p>
        <button
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => handleNotImplemented('Community posts')}
        >
          Turn on my Community
        </button>
      </div>
    </div>
  );

  const renderMentionsTab = () => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Filter..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      <div className="text-center py-12 bg-white border border-gray-200 rounded">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        <h3 className="text-lg font-medium mb-2">No mentions found</h3>
        <p className="text-sm text-gray-500">When others mention your channel, it'll appear here</p>
      </div>
    </div>
  );

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">Community</h1>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab('viewer-posts')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'viewer-posts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Viewer posts
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mentions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Mentions
          </button>
        </div>
      </div>

      {activeTab === 'comments' && renderCommentsTab()}
      {activeTab === 'viewer-posts' && renderViewerPostsTab()}
      {activeTab === 'mentions' && renderMentionsTab()}

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
                  <div className="space-y-2">
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
