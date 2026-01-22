const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.detail || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  baseUrl: API_BASE,
  getState: () => request('/state'),
  replaceState: (data, note, meta) =>
    request('/state', { method: 'PUT', body: JSON.stringify({ data, note, meta }) }),
  patchState: (data, note) =>
    request('/state', { method: 'PATCH', body: JSON.stringify({ data, note }) }),
  resetState: () => request('/state', { method: 'DELETE' }),
  getInfo: () => request('/info'),
  addToHistory: (videoId) =>
    request('/streamview/history', {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId }),
    }),
  removeFromHistory: (videoId) =>
    request(`/streamview/history/${videoId}`, { method: 'DELETE' }),
  clearHistory: () => request('/streamview/history', { method: 'DELETE' }),
  toggleLike: (videoId) => request(`/streamview/videos/${videoId}/like`, { method: 'POST' }),
  toggleDislike: (videoId) => request(`/streamview/videos/${videoId}/dislike`, { method: 'POST' }),
  toggleWatchLater: (videoId) =>
    request(`/streamview/videos/${videoId}/watch-later`, { method: 'POST' }),
  toggleSubscription: (channelId) =>
    request(`/streamview/channels/${channelId}/subscribe`, { method: 'POST' }),
  addComment: (payload) =>
    request('/streamview/comments', { method: 'POST', body: JSON.stringify(payload) }),
  toggleCommentLike: (commentId) =>
    request(`/streamview/comments/${commentId}/like`, { method: 'POST' }),
  toggleCommentDislike: (commentId) =>
    request(`/streamview/comments/${commentId}/dislike`, { method: 'POST' }),
  toggleCommentHeart: (commentId) =>
    request(`/streamview/comments/${commentId}/heart`, { method: 'POST' }),
  removeComment: (commentId) =>
    request(`/streamview/comments/${commentId}`, { method: 'DELETE' }),
  createPlaylist: (payload) =>
    request('/streamview/playlists', { method: 'POST', body: JSON.stringify(payload) }),
  togglePlaylistVideo: (playlistId, videoId) =>
    request(`/streamview/playlists/${playlistId}/videos/${videoId}`, { method: 'POST' }),
  markNotificationRead: (notificationId) =>
    request(`/streamview/notifications/${notificationId}/read`, { method: 'POST' }),
  markAllNotificationsRead: () =>
    request('/streamview/notifications/read-all', { method: 'POST' }),
  hideUser: (userId, userName, userAvatar = '') =>
    request('/streamview/users/hide', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, user_name: userName, user_avatar: userAvatar }),
    }),
  unhideUser: (userId) =>
    request(`/streamview/users/${userId}/hide`, { method: 'DELETE' }),
  addModerator: (userId, userName, userAvatar = '', moderatorType = 'standard') =>
    request('/streamview/users/moderator', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar,
        moderator_type: moderatorType,
      }),
    }),
  removeModerator: (userId, moderatorType = 'standard') =>
    request(`/streamview/users/${userId}/moderator?moderator_type=${moderatorType}`, {
      method: 'DELETE',
    }),
  reportComment: (commentId, reason, details = '') =>
    request(`/streamview/comments/${commentId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    }),
  uploadFiles: (files, { onProgress } = {}) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (typeof onProgress !== 'function') {
      return request('/files', { method: 'POST', body: formData });
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/files`, true);
      xhr.withCredentials = true;
      xhr.responseType = 'json';

      onProgress(null);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        } else {
          onProgress(null);
        }
      };

      xhr.onload = () => {
        const responseBody =
          xhr.response ||
          (() => {
            try {
              return JSON.parse(xhr.responseText || '{}');
            } catch (err) {
              return {};
            }
          })();
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(100);
          resolve(responseBody);
        } else {
          const message = responseBody.detail || xhr.statusText || 'Request failed';
          reject(new Error(message));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.send(formData);
    });
  },
  listFiles: () => request('/files'),
};
