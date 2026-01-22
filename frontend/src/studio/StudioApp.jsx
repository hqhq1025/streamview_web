import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../apiClient";
import { DataProvider, useData } from "../context/DataContext";
import { md5FromArrayBuffer } from "./utils/md5";
import { getVideoId } from "./utils/metrics";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Content from "./components/Content";
import UploadModal from "./components/UploadModal";
import VideoEdit from "./components/VideoEdit";
import Subtitles from "./components/Subtitles";
import AudioLibrary from "./components/AudioLibrary";
import Community from "./components/Community";
import Earn from "./components/Earn";
import Analytics from "./components/Analytics";
import Customization from "./components/Customization";
import Settings from "./components/Settings";
import PlaylistModal from "../components/PlaylistModal";
import PodcastModal from "../components/PodcastModal";
import LiveStreaming from "./components/LiveStreaming";

const COOKIE_NAME = import.meta.env.VITE_COOKIE_NAME || "user_id";
const COOKIE_MAX_AGE = Number(import.meta.env.VITE_COOKIE_MAX_AGE || 60 * 60 * 24 * 30);

// this function checks the URL for a "cookie" query parameter,
// sets the cookie accordingly, and reloads the page without the query parameter
// when build on the basesite, the below function should remain unchanged
const applyCookieFromQuery = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const override = url.searchParams.get("cookie");
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

const consumeUploadIntent = () => {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  const wantsUpload = url.searchParams.get("upload");
  if (!wantsUpload) return false;
  url.searchParams.delete("upload");
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", nextUrl);
  return true;
};

const buildSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

function StudioShell() {
  const { state, data, loading, refreshState, showToast } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);

  // UI State
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTab, setSelectedVideoTab] = useState("details");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Determine active view from URL
  const getActiveViewFromPath = (pathname) => {
    let normalizedPath = pathname;
    if (normalizedPath === "/studio") {
      normalizedPath = "/";
    } else if (normalizedPath.startsWith("/studio/")) {
      normalizedPath = normalizedPath.slice("/studio".length);
    }

    if (normalizedPath === "/" || normalizedPath === "") return "dashboard";
    if (normalizedPath.startsWith("/content")) return "content";
    if (normalizedPath.startsWith("/analytics")) return "analytics";
    if (normalizedPath.startsWith("/community")) return "community";
    if (normalizedPath.startsWith("/subtitles")) return "subtitles";
    if (normalizedPath.startsWith("/earn")) return "earn";
    if (normalizedPath.startsWith("/editing") || normalizedPath.startsWith("/customization")) return "customization";
    if (normalizedPath.startsWith("/audio-library")) return "audio-library";
    return "dashboard";
  };

  const activeView = getActiveViewFromPath(location.pathname);

  const user = data?.user || {};
  const creatorChannelId = user.channelId || user.userId || "creator-channel";
  const creatorName = (user.displayName || user.name || "Your Channel").trim() || "Your Channel";
  const creatorAvatar = user.avatar || "https://picsum.photos/100/100?random=creator";
  const creatorHandle = user.handle || "@creator";

  const creatorChannel =
    data?.channels?.find((channel) => channel.channelId === creatorChannelId) ||
    (creatorChannelId
      ? {
          channelId: creatorChannelId,
          name: creatorName,
          handle: creatorHandle,
          avatar: creatorAvatar,
          banner: "https://picsum.photos/1600/400?random=creator",
          description: "Welcome to your official channel.",
          subscriberCount: 0,
          videoCount: 0,
          joinedDate: new Date().toISOString().slice(0, 10),
          links: [],
          videos: [],
        }
      : null);

  const notifyNotImplemented = useCallback(
    (feature) => {
      const message = feature ? `${feature} is not implemented yet.` : "Not implemented yet.";
      if (typeof showToast === "function") {
        showToast(message);
      } else if (typeof window !== "undefined") {
        window.alert(message);
      }
    },
    [showToast]
  );

  const creatorVideos = useMemo(() => {
    const allVideos = data?.videos || [];
    return allVideos.filter((video) => {
      if (!video) return false;
      if (video.origin === "studio") return true;
      if (!video.channelId) return true;
      return video.channelId === creatorChannelId;
    });
  }, [data, creatorChannelId]);

  const handleUpload = async ({ file, visibility, title, description, onProgress } = {}) => {
    if (!file) return;
    try {
      setIsBusy(true);
      if (typeof onProgress === "function") {
        onProgress(null);
      }
      const arrayBuffer = file.arrayBuffer
        ? await file.arrayBuffer()
        : await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Failed to read file."));
            reader.readAsArrayBuffer(file);
          });
      if (!(arrayBuffer instanceof ArrayBuffer)) {
        throw new Error("Failed to read file data.");
      }
      const contentMd5 = md5FromArrayBuffer(arrayBuffer);

      const uploadResponse = await api.uploadFiles([file], { onProgress });
      const uploaded = uploadResponse?.files?.[0];
      if (!uploaded) {
        throw new Error("Upload failed.");
      }

      const nextVisibility = visibility || "Public";
      const nextTitle = (title || file.name || "Untitled").trim();
      const nextDescription = (description || "").trim();
      const now = new Date().toISOString();
      const videoSeed = uploaded.id || `${Date.now()}`;
      const safeTitle = nextTitle || "Untitled upload";
      const thumbnailSeed = encodeURIComponent(videoSeed);
      const currentVideos = data?.videos || [];
      const currentChannels = data?.channels || [];
      const nextVideoId = `upload-${videoSeed}`;
      const nextVideos = [
        ...currentVideos,
        {
          id: uploaded.id,
          videoId: nextVideoId,
          title: nextTitle,
          description: nextDescription,
          visibility: nextVisibility,
          status: "draft",
          uploaded_at: now,
          uploadDate: now,
          channelId: creatorChannelId,
          channelName: creatorName || "Your Channel",
          channelAvatar: creatorAvatar,
          thumbnail: `https://picsum.photos/seed/${thumbnailSeed}/640/360`,
          duration: "0:00",
          viewCount: 0,
          likeCount: 0,
          dislikeCount: 0,
          commentCount: 0,
          category: "Uploads",
          tags: ["studio", "upload"],
          youtubeId: videoSeed.slice(0, 11),
          videoUrl: uploaded.url,
          watchUrl: uploaded.url,
          origin: "studio",
          asset: {
            id: uploaded.id,
            original_filename: uploaded.name || file.name,
            stored_filename: uploaded.filename,
            content_type: uploaded.type || file.type || "application/octet-stream",
            size_bytes: file.size,
            url: uploaded.url,
            content_md5: contentMd5,
          },
          title_slug: buildSlug(safeTitle),
        },
      ];
      const creatorVideoCount = nextVideos.filter((video) => {
        if (!video) return false;
        if (video.origin === "studio") return true;
        if (!video.channelId) return true;
        return video.channelId === creatorChannelId;
      }).length;
      const hasCreatorChannel = currentChannels.some(
        (channel) => channel.channelId === creatorChannelId
      );
      const nextChannels = hasCreatorChannel
        ? currentChannels.map((channel) =>
            channel.channelId === creatorChannelId
              ? { ...channel, videoCount: creatorVideoCount }
              : channel
          )
        : [
            ...currentChannels,
            {
              channelId: creatorChannelId,
              name: creatorName,
              handle: creatorHandle,
              avatar: creatorAvatar,
              banner: "https://picsum.photos/1600/400?random=creator",
              description: "Welcome to your official channel.",
              subscriberCount: 0,
              videoCount: creatorVideoCount,
              joinedDate: new Date().toISOString().slice(0, 10),
              links: [],
              videos: [],
            },
          ];
      const nextComments = {
        ...(data?.comments || {}),
        [nextVideoId]: data?.comments?.[nextVideoId] || [],
      };

      await api.patchState({ videos: nextVideos, channels: nextChannels, comments: nextComments });
      await refreshState();
      navigate("/studio/content");
      showToast("Video uploaded");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Upload failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = useCallback((query) => {
    // Search across videos, navigate to content page with filter
    if (query && query.trim()) {
      showToast(`Searching for: ${query}`);
      // Navigate to content page to show search results
      navigate("/studio/content");
      // In a full implementation, we would pass the search query as a filter
      // For now, this demonstrates the search interaction works
    }
  }, [showToast, navigate]);

  useEffect(() => {
    if (consumeUploadIntent()) {
      setIsUploadModalOpen(true);
      navigate("/studio/content");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state?.data?.open_upload_modal) {
      setIsUploadModalOpen(true);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#0d0d0d] font-sans">
      <TopBar
        onCreateClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
        onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        channelName={creatorName}
        onNotImplemented={notifyNotImplemented}
        onSearch={handleSearch}
      />

      {isCreateMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsCreateMenuOpen(false)}
          />
          <div className="fixed top-14 right-20 bg-white border border-[#e5e5e5] rounded shadow-lg z-50 w-56 py-2">
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] flex items-center gap-3 text-[#0d0d0d]"
              onClick={() => {
                setIsCreateMenuOpen(false);
                setIsUploadModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path>
              </svg>
              <span className="text-sm">Upload videos</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] flex items-center gap-3 text-[#0d0d0d]"
              onClick={() => {
                setIsCreateMenuOpen(false);
                setIsGoLiveModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path>
              </svg>
              <span className="text-sm">Go live</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] flex items-center gap-3 text-[#0d0d0d]"
              onClick={() => {
                setIsCreateMenuOpen(false);
                setIsCreatePostModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5zm1 2h12v12H6V5zm9 7H9v2h6v-2z"></path>
              </svg>
              <span className="text-sm">Create post</span>
            </button>
            <div className="border-t border-[#e5e5e5] my-2"></div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] flex items-center gap-3 text-[#0d0d0d]"
              onClick={() => {
                setIsCreateMenuOpen(false);
                setIsPlaylistModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z"></path>
              </svg>
              <span className="text-sm">New playlist</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] flex items-center gap-3 text-[#0d0d0d]"
              onClick={() => {
                setIsCreateMenuOpen(false);
                setIsPodcastModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-9c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
              </svg>
              <span className="text-sm">New podcast</span>
            </button>
          </div>
        </>
      )}

      <Sidebar
        activeItem={activeView}
        onNavigate={(view) => {
          if (view === "settings") {
            setIsSettingsOpen(true);
          } else if (view === "send-feedback") {
            notifyNotImplemented("Send feedback");
          } else if (view === "dashboard") {
            navigate("/studio");
          } else if (view === "customization") {
            navigate("/studio/editing/profile");
          } else {
            navigate(`/studio/${view}`);
          }
        }}
        channelName={creatorName}
        isCollapsed={isSidebarCollapsed}
      />

      <div className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        {activeView === "dashboard" && (
          <Dashboard
            videos={creatorVideos}
            commentsByVideo={data?.comments || {}}
            channel={creatorChannel}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onGoLiveClick={() => setIsGoLiveModalOpen(true)}
            onCreatePostClick={() => setIsCreatePostModalOpen(true)}
            onSelectVideo={(videoId, tab = "details") => {
              if (!videoId) return;
              setSelectedVideoId(videoId);
              setSelectedVideoTab(tab);
              navigate("/studio/content");
            }}
            onNavigate={(view) => {
              if (view === "customization") {
                navigate("/studio/editing/profile");
              } else {
                navigate(`/studio/${view}`);
              }
            }}
            onNotImplemented={notifyNotImplemented}
          />
        )}
        {activeView === "content" && !selectedVideoId && (
          <Content
            videos={creatorVideos}
            commentsByVideo={data?.comments || {}}
            onVideoClick={(videoId, tab = "details") => {
              setSelectedVideoId(videoId);
              setSelectedVideoTab(tab);
            }}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onNotImplemented={notifyNotImplemented}
          />
        )}
        {activeView === "content" && selectedVideoId && (
          <VideoEdit
            video={creatorVideos.find(
              (v) => getVideoId(v) === selectedVideoId || v?.id === selectedVideoId
            )}
            onBack={() => {
              setSelectedVideoId(null);
              setSelectedVideoTab("details");
            }}
            initialTab={selectedVideoTab}
            onNotImplemented={notifyNotImplemented}
          />
        )}
        {activeView === "subtitles" && (
          <Subtitles
            videos={creatorVideos.length > 0 ? creatorVideos : data?.videos || []}
            onVideoClick={(videoId) => {
              navigate("/studio/subtitles");
            }}
          />
        )}
        {activeView === "audio-library" && (
          <AudioLibrary onNotImplemented={notifyNotImplemented} />
        )}
        {activeView === "community" && (
          <Community
            videos={creatorVideos}
            onNotImplemented={notifyNotImplemented}
          />
        )}
        {activeView === "earn" && <Earn onNotImplemented={notifyNotImplemented} />}
        {activeView === "analytics" && (
          <Analytics
            videos={creatorVideos.length > 0 ? creatorVideos : data?.videos || []}
            commentsByVideo={data?.comments || {}}
            channel={creatorChannel}
            onSelectVideo={(videoId, tab = "analytics") => {
              if (!videoId) return;
              setSelectedVideoId(videoId);
              setSelectedVideoTab(tab);
              navigate("/studio/content");
            }}
            onNotImplemented={notifyNotImplemented}
          />
        )}
        {activeView === "customization" && (
          <Customization onNotImplemented={notifyNotImplemented} />
        )}
        {activeView !== "dashboard" &&
          activeView !== "content" &&
          activeView !== "subtitles" &&
          activeView !== "audio-library" &&
          activeView !== "community" &&
          activeView !== "earn" &&
          activeView !== "analytics" &&
          activeView !== "customization" && (
            <div className="p-8 text-center text-[#606060]">
              <h2 className="text-xl font-medium">Coming Soon</h2>
              <p>The {activeView} page is under construction.</p>
            </div>
          )}
      </div>

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
          onNotImplemented={notifyNotImplemented}
        />
      )}

      {isSettingsOpen && (
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onNotImplemented={notifyNotImplemented}
        />
      )}

      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        videoId={null}
      />

      <PodcastModal
        isOpen={isPodcastModalOpen}
        onClose={() => setIsPodcastModalOpen(false)}
        showToast={showToast}
      />

      {isGoLiveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsGoLiveModalOpen(false)}>
          <div
            className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#0d0d0d]">Go live</h2>
              <button
                onClick={() => setIsGoLiveModalOpen(false)}
                className="p-2 hover:bg-[#f9f9f9] rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <LiveStreaming onNotImplemented={notifyNotImplemented} />
          </div>
        </div>
      )}

      {isCreatePostModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsCreatePostModalOpen(false)}>
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#0d0d0d]">Create post</h2>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="p-2 hover:bg-[#f9f9f9] rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Channel
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-[#f9f9f9] rounded">
                  <div className="w-10 h-10 rounded-full bg-[#065fd4] text-white flex items-center justify-center font-medium">
                    {creatorName.charAt(0)}
                  </div>
                  <span className="text-sm text-[#0d0d0d]">{creatorName}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
                  Post content
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-[#d0d0d0] rounded resize-none focus:outline-none focus:border-[#065fd4] text-sm"
                  rows="6"
                  placeholder="Share something with your community..."
                />
              </div>
              <div className="mb-6">
                <button className="flex items-center gap-2 text-sm text-[#065fd4] hover:bg-[#f0f7ff] px-3 py-2 rounded transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z" />
                  </svg>
                  Add image or video
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e5e5e5] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#606060] hover:bg-[#f9f9f9] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast("Post created successfully");
                  setIsCreatePostModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium bg-[#065fd4] text-white hover:bg-[#0553c2] rounded transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {(loading || isBusy) && (
        <div className="fixed bottom-4 right-4 bg-white border border-[#e5e5e5] text-sm text-[#606060] px-3 py-2 rounded shadow">
          Syncing studio data...
        </div>
      )}
    </div>
  );
}

export default function StudioApp() {
  // check if host starts with "studio."
  let path = "/studio";
  let isStudioHost = false;
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    isStudioHost = hostname.startsWith("studio.");
    if (isStudioHost) {
      path = "";
    }
  }

  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path={path} element={<StudioShell />} />
          <Route path={`${path}/*`} element={<StudioShell />} />
          <Route path={`${path}/customization`} element={<Navigate to={`${path}/editing/profile`} replace />} />
        </Routes>
      </DataProvider>
    </Router>
  );
}
