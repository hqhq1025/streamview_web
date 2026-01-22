export const getVideoId = (video) => {
  if (!video) return '';
  return video.videoId || video.id || video.youtubeId || '';
};

export const getVideoViews = (video) => {
  if (!video) return 0;
  if (Number.isFinite(video.viewCount)) return video.viewCount;
  if (Number.isFinite(video.views)) return video.views;
  return 0;
};

export const getVideoLikes = (video) => {
  if (!video) return 0;
  if (Number.isFinite(video.likeCount)) return video.likeCount;
  if (Number.isFinite(video.likes)) return video.likes;
  return 0;
};

export const getVideoDislikes = (video) => {
  if (!video) return 0;
  if (Number.isFinite(video.dislikeCount)) return video.dislikeCount;
  return 0;
};

export const getVideoUploadDate = (video) => {
  if (!video) return '';
  return video.uploadDate || video.uploaded_at || video.date || '';
};

export const parseDurationToSeconds = (duration) => {
  if (typeof duration !== 'string') return 0;
  const parts = duration.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return 0;
};

export const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const rounded = Math.round(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

export const buildVideoLookup = (videos = []) => {
  return videos.reduce((acc, video) => {
    const id = getVideoId(video);
    if (id) {
      acc[id] = video;
    }
    return acc;
  }, {});
};

export const flattenComments = (commentsByVideo = {}) => {
  const entries = [];
  Object.entries(commentsByVideo || {}).forEach(([videoId, commentList]) => {
    (commentList || []).forEach((comment) => {
      entries.push({ ...comment, videoId });
    });
  });
  return entries;
};
