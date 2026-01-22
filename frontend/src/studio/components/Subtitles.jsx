import { useState } from 'react';

function Subtitles({ videos = [], onVideoClick }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [makeDefault, setMakeDefault] = useState(true);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [videoLanguages, setVideoLanguages] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Comprehensive language list with regional variants
  const languages = [
    "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani",
    "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Burmese",
    "Catalan", "Cebuano", "Chinese (Simplified)", "Chinese (Traditional)",
    "Chinese (Hong Kong)", "Chinese (Taiwan)", "Corsican", "Croatian", "Czech",
    "Danish", "Dutch", "Dutch (Belgium)", "English", "English (UK)",
    "English (US)", "English (Australia)", "English (Canada)", "English (India)",
    "Esperanto", "Estonian", "Filipino", "Finnish", "French", "French (Canada)",
    "Frisian", "Galician", "Georgian", "German", "German (Austria)",
    "German (Switzerland)", "Greek", "Gujarati", "Haitian Creole", "Hausa",
    "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic",
    "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese",
    "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Kurdish",
    "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish",
    "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori",
    "Marathi", "Mongolian", "Nepali", "Norwegian", "Nyanja", "Odia",
    "Pashto", "Persian", "Polish", "Portuguese", "Portuguese (Brazil)",
    "Portuguese (Portugal)", "Punjabi", "Romanian", "Russian", "Samoan",
    "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala",
    "Slovak", "Slovenian", "Somali", "Spanish", "Spanish (Latin America)",
    "Spanish (Mexico)", "Spanish (Spain)", "Sundanese", "Swahili", "Swedish",
    "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen",
    "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh",
    "Xhosa", "Yiddish", "Yoruba", "Zulu",
    "American Sign Language (ASL)", "British Sign Language (BSL)", "Klingon"
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'published', label: 'Published' }
  ];

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowLanguageDropdown(false);
    setShowAddLanguage(false);
  };

  const handleBackToChannel = () => {
    setSelectedVideo(null);
    setShowLanguageDropdown(false);
    setShowAddLanguage(false);
    setSelectedLanguage('');
  };

  const handleSetLanguage = () => {
    if (!selectedLanguage || !selectedVideo) return;

    const videoId = selectedVideo.id || selectedVideo.videoId;
    setVideoLanguages(prev => ({
      ...prev,
      [videoId]: {
        primary: selectedLanguage,
        languages: [selectedLanguage],
        modified: new Date().toISOString()
      }
    }));

    setShowLanguageDropdown(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleAddLanguage = (lang) => {
    if (!selectedVideo) return;

    const videoId = selectedVideo.id || selectedVideo.videoId;
    const current = videoLanguages[videoId] || { primary: '', languages: [], modified: new Date().toISOString() };

    if (!current.languages.includes(lang)) {
      setVideoLanguages(prev => ({
        ...prev,
        [videoId]: {
          ...current,
          languages: [...current.languages, lang],
          modified: new Date().toISOString()
        }
      }));
    }

    setShowAddLanguage(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getVideoLanguageCount = (video) => {
    const videoId = video.id || video.videoId;
    const langData = videoLanguages[videoId];
    return langData ? langData.languages.length : 0;
  };

  const getModifiedDate = (video) => {
    const videoId = video.id || video.videoId;
    const langData = videoLanguages[videoId];
    if (langData?.modified) {
      const date = new Date(langData.modified);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
    return video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : 'N/A';
  };

  // Filter videos based on active tab
  const filteredVideos = videos.filter(video => {
    if (activeTab === 'all') return true;
    const videoId = video.id || video.videoId;
    const langData = videoLanguages[videoId];
    if (activeTab === 'drafts') {
      // Videos with languages set but not published
      return langData && langData.languages.length > 0;
    }
    if (activeTab === 'published') {
      // For now, all videos with languages are considered published
      return langData && langData.languages.length > 0;
    }
    return true;
  });

  if (selectedVideo) {
    const videoId = selectedVideo.id || selectedVideo.videoId;
    const langData = videoLanguages[videoId];
    const hasLanguage = langData && langData.primary;

    return (
      <div className="p-8">
        {/* Feature #114: Visual hierarchy - Breadcrumb navigation */}
        <button
          onClick={handleBackToChannel}
          className="flex items-center gap-2 text-[#065fd4] hover:underline mb-8 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
          </svg>
          <span className="text-sm font-medium">Channel subtitles</span>
        </button>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-600">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
            </svg>
            All changes saved
          </div>
        )}

        {/* Feature #114: Visual hierarchy - Video Info section */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-[#0d0d0d] mb-2">
            {selectedVideo.title || 'Untitled Video'}
          </h1>
          <p className="text-sm text-[#606060]">Video subtitles and metadata translations</p>
        </div>

        {/* Feature #114: Visual hierarchy - Set Language Section */}
        {!hasLanguage && (
          <div className="bg-white border border-[#e5e5e5] rounded p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-3">Set video language</h2>
            <p className="text-sm text-[#606060] mb-6 leading-relaxed">
              Choose the language spoken in this video. This helps viewers find your content.
            </p>

            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="px-4 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0553c2] text-sm font-medium"
            >
              Set language
            </button>

            {/* Feature #112: Language dropdown with proper styling */}
            {showLanguageDropdown && (
              <div className="mt-4 border border-[#e5e5e5] rounded bg-white max-h-96 overflow-hidden flex flex-col shadow-lg">
                <div className="p-3 border-b border-[#e5e5e5] bg-white sticky top-0 z-10">
                  <input
                    type="text"
                    placeholder="Search languages..."
                    className="w-full px-3 py-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#065fd4] focus:ring-1 focus:ring-[#065fd4] transition-colors"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 scrollbar-thin">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-[#e8f0fe] text-[#065fd4] font-medium'
                          : 'text-[#0d0d0d] hover:bg-[#f2f2f2]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-[#e5e5e5] bg-[#f9f9f9]">
                  <label className="flex items-center gap-2 mb-3 text-sm text-[#0d0d0d] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makeDefault}
                      onChange={(e) => setMakeDefault(e.target.checked)}
                      className="w-4 h-4 accent-[#065fd4] cursor-pointer"
                    />
                    <span>Make this the default for my channel</span>
                  </label>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setShowLanguageDropdown(false);
                        setSelectedLanguage('');
                      }}
                      className="px-4 py-2 text-[#065fd4] hover:bg-[#e8f0fe] rounded text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSetLanguage}
                      disabled={!selectedLanguage}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        selectedLanguage
                          ? 'bg-[#065fd4] text-white hover:bg-[#0553c2]'
                          : 'bg-[#e5e5e5] text-[#909090] cursor-not-allowed'
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature #114: Visual hierarchy - Translations Table */}
        {hasLanguage && (
          <div className="bg-white border border-[#e5e5e5] rounded shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e5e5e5] flex items-center justify-between bg-[#f9f9f9]">
              <h2 className="text-lg font-medium text-[#0d0d0d]">Translations</h2>
              <button
                onClick={() => setShowAddLanguage(!showAddLanguage)}
                className="px-4 py-2 text-[#065fd4] hover:bg-[#f2f2f2] rounded text-sm font-medium flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                </svg>
                Add language
              </button>
            </div>

            {showAddLanguage && (
              <div className="border-b border-[#e5e5e5] bg-[#f9f9f9] p-4">
                <div className="bg-white border border-[#e5e5e5] rounded max-h-64 overflow-y-auto">
                  {languages.filter(lang => !langData.languages.includes(lang)).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleAddLanguage(lang)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[#f2f2f2] text-[#0d0d0d]"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-white">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#606060] uppercase tracking-wide">Language</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#606060] uppercase tracking-wide">Subtitles</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#606060] uppercase tracking-wide">Title & description</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#606060] uppercase tracking-wide">Published</th>
                </tr>
              </thead>
              <tbody>
                {langData.languages.map((lang, index) => (
                  <tr key={lang} className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-5 py-4 text-sm text-[#0d0d0d]">
                      <span className="font-medium">{lang}</span>
                      {index === 0 && (
                        <span className="ml-2 text-xs text-[#606060] bg-[#f2f2f2] px-2 py-0.5 rounded">(video language)</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#606060]">–</td>
                    <td className="px-5 py-4 text-sm text-[#606060]">–</td>
                    <td className="px-5 py-4 text-sm">
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Channel-level view
  return (
    <div className="p-8">
      {/* Feature #114: Visual hierarchy - Page heading */}
      <h1 className="text-2xl font-normal text-[#0d0d0d] mb-8">Channel subtitles</h1>

      {/* Tabs - Feature #113: Proper active/inactive states */}
      <div className="mb-6 border-b border-[#e5e5e5]">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium relative transition-colors ${
                activeTab === tab.id
                  ? 'text-[#065fd4]'
                  : 'text-[#606060] hover:text-[#0d0d0d]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#065fd4] transition-all"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Table - Feature #111: Proper table layout with aligned columns */}
      <div className="bg-white border border-[#e5e5e5] rounded overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#606060] uppercase tracking-wide w-7/12">Video</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#606060] uppercase tracking-wide w-2/12">Languages</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#606060] uppercase tracking-wide w-3/12">Modified on</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video) => {
              const langCount = getVideoLanguageCount(video);
              return (
                <tr
                  key={video.id || video.videoId}
                  className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9] cursor-pointer transition-colors"
                  onClick={() => handleVideoClick(video)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-24 h-14 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#065fd4] hover:underline font-medium truncate">
                          {video.title}
                        </div>
                        {video.description && (
                          <div className="text-xs text-[#606060] truncate mt-1">
                            {video.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-[#0d0d0d] font-medium">
                      {langCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#606060]">
                      {getModifiedDate(video)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredVideos.length === 0 && (
          <div className="p-12 text-center text-[#606060]">
            <p className="text-sm">No videos found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subtitles;
