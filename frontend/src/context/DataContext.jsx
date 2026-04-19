import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../apiClient';

const COOKIE_NAME = import.meta.env.VITE_COOKIE_NAME || 'user_id';
const COOKIE_MAX_AGE = Number(import.meta.env.VITE_COOKIE_MAX_AGE || 60 * 60 * 24 * 30);

const applyCookieFromQuery = () => {
  if (typeof window === 'undefined') return false;
  const url = new URL(window.location.href);
  const override = url.searchParams.get('cookie');
  if (!override) return false;
  let cookie = `${COOKIE_NAME}=${encodeURIComponent(override)}; Path=/; SameSite=Lax`;
  if (Number.isFinite(COOKIE_MAX_AGE) && COOKIE_MAX_AGE > 0) {
    cookie += `; Max-Age=${Math.floor(COOKIE_MAX_AGE)}`;
  }
  document.cookie = cookie;
  const redirectUrl = url.origin;
  if (window.location.href !== redirectUrl) {
    window.location.replace(redirectUrl);
    return true;
  }
  return false;
};

const emptyData = {
  user: {
    userId: '',
    displayName: 'Loading...',
    email: '',
    handle: '',
    avatar: 'https://picsum.photos/100/100?random=placeholder',
    subscribedChannels: [],
    watchHistory: [],
    likedVideos: [],
    dislikedVideos: [],
    watchLater: [],
    playlists: [],
    commentReactions: {},
  },
  videos: [],
  channels: [],
  comments: {},
  playlists: [],
  notifications: [],
  categories: [],
};

const normalizeData = (incoming) => {
  if (!incoming) return emptyData;
  return {
    ...emptyData,
    ...incoming,
    user: {
      ...emptyData.user,
      ...(incoming.user || {}),
    },
    comments: incoming.comments || {},
    videos: incoming.videos || [],
    channels: incoming.channels || [],
    playlists: incoming.playlists || [],
    notifications: incoming.notifications || [],
    categories: incoming.categories || [],
  };
};

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [miniPlayer, setMiniPlayer] = useState(null);

  const hydrate = useCallback(async () => {
    setLoading(true);
    try {
      const next = await api.getState();
      setState(next.state);
      setData(normalizeData(next.state?.data));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load state');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const redirected = applyCookieFromQuery();
    if (redirected) return;
    hydrate();
  }, [hydrate]);

  const applyAction = useCallback(async (action, fallbackMessage) => {
    try {
      const next = await action();
      setState(next.state);
      setData(normalizeData(next.state?.data));
      setError('');
      return next;
    } catch (err) {
      const message = err.message || fallbackMessage || 'Request failed';
      setError(message);
      throw err;
    }
  }, []);

  const refreshState = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  const addToWatchHistory = useCallback(
    async (videoId) => applyAction(() => api.addToHistory(videoId)),
    [applyAction]
  );

  const toggleLike = useCallback(
    async (videoId) => applyAction(() => api.toggleLike(videoId)),
    [applyAction]
  );

  const toggleDislike = useCallback(
    async (videoId) => applyAction(() => api.toggleDislike(videoId)),
    [applyAction]
  );

  const toggleWatchLater = useCallback(
    async (videoId) => applyAction(() => api.toggleWatchLater(videoId)),
    [applyAction]
  );

  const toggleSubscription = useCallback(
    async (channelId) => applyAction(() => api.toggleSubscription(channelId)),
    [applyAction]
  );

  const addComment = useCallback(
    async (videoId, text, parentCommentId = null) =>
      applyAction(() => api.addComment({ video_id: videoId, text, parent_comment_id: parentCommentId })),
    [applyAction]
  );

  const toggleCommentLike = useCallback(
    async (commentId) => applyAction(() => api.toggleCommentLike(commentId)),
    [applyAction]
  );

  const toggleCommentDislike = useCallback(
    async (commentId) => applyAction(() => api.toggleCommentDislike(commentId)),
    [applyAction]
  );

  const toggleCommentHeart = useCallback(
    async (commentId) => applyAction(() => api.toggleCommentHeart(commentId)),
    [applyAction]
  );

  const removeComment = useCallback(
    async (commentId) => applyAction(() => api.removeComment(commentId)),
    [applyAction]
  );

  const createPlaylist = useCallback(
    async (name, description, privacy) =>
      applyAction(() => api.createPlaylist({ name, description, privacy })),
    [applyAction]
  );

  const addToPlaylist = useCallback(
    async (playlistId, videoId) =>
      applyAction(() => api.togglePlaylistVideo(playlistId, videoId)),
    [applyAction]
  );

  const removeFromHistory = useCallback(
    async (videoId) => applyAction(() => api.removeFromHistory(videoId)),
    [applyAction]
  );

  const clearHistory = useCallback(
    async () => applyAction(() => api.clearHistory()),
    [applyAction]
  );

  const markNotificationAsRead = useCallback(
    async (notificationId) =>
      applyAction(() => api.markNotificationRead(notificationId)),
    [applyAction]
  );

  const markAllNotificationsAsRead = useCallback(
    async () => applyAction(() => api.markAllNotificationsRead()),
    [applyAction]
  );

  const updateVideoDetails = useCallback(
    async (videoId, updates) => {
      const nextVideos = data.videos.map((video) => {
        const matches =
          video?.videoId === videoId ||
          video?.id === videoId ||
          video?.youtubeId === videoId;
        if (!matches) return video;
        const nextTitle = updates?.title ?? video.title;
        const nextSlug =
          typeof nextTitle === 'string' && nextTitle.trim()
            ? nextTitle
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
            : video.title_slug;
        return {
          ...video,
          ...updates,
          ...(nextSlug ? { title_slug: nextSlug } : {}),
        };
      });
      return applyAction(() => api.patchState({ videos: nextVideos }), 'Failed to update video');
    },
    [applyAction, data.videos]
  );

  const hideUser = useCallback(
    async (userId, userName, userAvatar = '') =>
      applyAction(() => api.hideUser(userId, userName, userAvatar)),
    [applyAction]
  );

  const unhideUser = useCallback(
    async (userId) => applyAction(() => api.unhideUser(userId)),
    [applyAction]
  );

  const addModerator = useCallback(
    async (userId, userName, userAvatar = '', moderatorType = 'standard') =>
      applyAction(() => api.addModerator(userId, userName, userAvatar, moderatorType)),
    [applyAction]
  );

  const removeModerator = useCallback(
    async (userId, moderatorType = 'standard') =>
      applyAction(() => api.removeModerator(userId, moderatorType)),
    [applyAction]
  );

  const reportComment = useCallback(
    async (commentId, reason, details = '') =>
      applyAction(() => api.reportComment(commentId, reason, details)),
    [applyAction]
  );

  const publishVideo = useCallback(
    async (videoId) => applyAction(() => api.publishVideo(videoId), 'Failed to publish video'),
    [applyAction]
  );

  const uploadVideo = useCallback(
    async (payload, options) =>
      applyAction(() => api.uploadVideo(payload, options), 'Failed to upload video'),
    [applyAction]
  );

  const showToast = useCallback((message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }, []);

  const value = useMemo(
    () => ({
      state,
      data,
      loading,
      error,
      refreshState,
      addToWatchHistory,
      toggleLike,
      toggleDislike,
      toggleWatchLater,
      toggleSubscription,
      addComment,
      toggleCommentLike,
      toggleCommentDislike,
      toggleCommentHeart,
      removeComment,
      createPlaylist,
      addToPlaylist,
      removeFromHistory,
      clearHistory,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateVideoDetails,
      hideUser,
      unhideUser,
      addModerator,
      removeModerator,
      reportComment,
      publishVideo,
      uploadVideo,
      showToast,
      miniPlayer,
      setMiniPlayer,
    }),
    [
      state,
      data,
      loading,
      error,
      refreshState,
      addToWatchHistory,
      toggleLike,
      toggleDislike,
      toggleWatchLater,
      toggleSubscription,
      addComment,
      toggleCommentLike,
      toggleCommentDislike,
      toggleCommentHeart,
      removeComment,
      createPlaylist,
      addToPlaylist,
      removeFromHistory,
      clearHistory,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateVideoDetails,
      hideUser,
      unhideUser,
      addModerator,
      removeModerator,
      reportComment,
      publishVideo,
      uploadVideo,
      showToast,
      miniPlayer,
    ]
  );

  if (loading && !state) {
    return <div className="app-loading">Loading your feed...</div>;
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
