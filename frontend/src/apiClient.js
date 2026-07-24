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
    const detail = errorBody.detail;
    const message =
      (detail && typeof detail === 'object' && detail.message) ||
      (typeof detail === 'string' ? detail : null) ||
      response.statusText ||
      'Request failed';
    throw new Error(message);
  }

  return response.json();
}

const asProductState = (payload) => ({
  user_id: payload.user_id,
  state: { data: payload.data },
});

const productRequest = (path, options) => request(path, options).then(asProductState);

export const api = {
  baseUrl: API_BASE,
  getBootstrap: () =>
    productRequest('/streamview/bootstrap'),
  updateVideo: (videoId, updates) =>
    request(`/streamview/videos/${videoId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }).then(() => api.getBootstrap()),
  finalizeVideo: (videoId) =>
    request(`/streamview/videos/${videoId}/finalize`, { method: 'POST' }),
  getInfo: () => request('/info'),
  addToHistory: (videoId) =>
    productRequest('/streamview/history', {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId }),
    }),
  removeFromHistory: (videoId) =>
    productRequest(`/streamview/history/${videoId}`, { method: 'DELETE' }),
  clearHistory: () => productRequest('/streamview/history', { method: 'DELETE' }),
  toggleLike: (videoId) => productRequest(`/streamview/videos/${videoId}/like`, { method: 'POST' }),
  toggleDislike: (videoId) => productRequest(`/streamview/videos/${videoId}/dislike`, { method: 'POST' }),
  toggleWatchLater: (videoId) =>
    productRequest(`/streamview/videos/${videoId}/watch-later`, { method: 'POST' }),
  toggleSubscription: (channelId) =>
    productRequest(`/streamview/channels/${channelId}/subscribe`, { method: 'POST' }),
  addComment: (payload) =>
    productRequest('/streamview/comments', { method: 'POST', body: JSON.stringify(payload) }),
  toggleCommentLike: (commentId) =>
    productRequest(`/streamview/comments/${commentId}/like`, { method: 'POST' }),
  toggleCommentDislike: (commentId) =>
    productRequest(`/streamview/comments/${commentId}/dislike`, { method: 'POST' }),
  toggleCommentHeart: (commentId) =>
    productRequest(`/streamview/comments/${commentId}/heart`, { method: 'POST' }),
  removeComment: (commentId) =>
    productRequest(`/streamview/comments/${commentId}`, { method: 'DELETE' }),
  createPlaylist: (payload) =>
    productRequest('/streamview/playlists', { method: 'POST', body: JSON.stringify(payload) }),
  togglePlaylistVideo: (playlistId, videoId) =>
    productRequest(`/streamview/playlists/${playlistId}/videos/${videoId}`, { method: 'POST' }),
  markNotificationRead: (notificationId) =>
    productRequest(`/streamview/notifications/${notificationId}/read`, { method: 'POST' }),
  markAllNotificationsRead: () =>
    productRequest('/streamview/notifications/read-all', { method: 'POST' }),
  hideUser: (userId, userName, userAvatar = '') =>
    productRequest('/streamview/users/hide', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, user_name: userName, user_avatar: userAvatar }),
    }),
  unhideUser: (userId) =>
    productRequest(`/streamview/users/${userId}/hide`, { method: 'DELETE' }),
  addModerator: (userId, userName, userAvatar = '', moderatorType = 'standard') =>
    productRequest('/streamview/users/moderator', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar,
        moderator_type: moderatorType,
      }),
    }),
  removeModerator: (userId, moderatorType = 'standard') =>
    productRequest(`/streamview/users/${userId}/moderator?moderator_type=${moderatorType}`, {
      method: 'DELETE',
    }),
  reportComment: (commentId, reason, details = '') =>
    productRequest(`/streamview/comments/${commentId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    }),
  uploadVideo: ({ file, title, description = '', tags = '', visibility = 'public' }, { onProgress } = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
    formData.append('visibility', String(visibility || 'public').toLowerCase());

    if (typeof onProgress !== 'function') {
      return productRequest('/streamview/videos', { method: 'POST', body: formData });
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/streamview/videos`, true);
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
          resolve(asProductState(responseBody));
        } else {
          const detail = responseBody.detail;
          const message =
            (detail && typeof detail === 'object' && detail.message) ||
            detail ||
            xhr.statusText ||
            'Upload failed';
          reject(new Error(message));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.send(formData);
    });
  },
  publishVideo: (videoId) =>
    productRequest(`/streamview/videos/${videoId}/publish`, { method: 'POST' }),
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
