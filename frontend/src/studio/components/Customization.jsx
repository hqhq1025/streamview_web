import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Customization({ onNotImplemented }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL
  const getActiveTabFromPath = (pathname) => {
    if (pathname.includes('/hometab')) return 'home-tab';
    return 'profile'; // default to profile
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname));

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  // Form state for profile
  const [channelName, setChannelName] = useState("Tony's Channel");
  const [handle, setHandle] = useState("tonyzhou3956");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [links, setLinks] = useState([]);
  const [showPronounInterface, setShowPronounInterface] = useState(false);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  // Home tab state
  const [homeTabEnabled, setHomeTabEnabled] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [sections, setSections] = useState([
    { id: 'for-you', title: 'For You', description: 'Personalized recommendations for your viewers', count: null, removable: false },
    { id: 'videos', title: 'Videos', count: 1, removable: true },
    { id: 'shorts', title: 'Short videos', count: 0, removable: true, emptyMessage: 'This section will appear after a short video has been uploaded' },
    { id: 'live', title: 'Past live streams', count: 0, removable: true, emptyMessage: 'This section will appear after you go live' },
    { id: 'playlists', title: 'Created playlists', count: 1, removable: true },
    { id: 'posts', title: 'Posts', count: 0, removable: true, emptyMessage: 'This section will appear after you create a post' },
    { id: 'collaborations', title: 'Collaborations', count: 0, removable: true, emptyMessage: 'This section will appear after you collaborate on a video' },
  ]);
  const [expandedSection, setExpandedSection] = useState(null);

  // Change tracking
  const [hasChanges, setHasChanges] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const availableSections = [
    'Channel trailer',
    'Spotlight (for returning subscribers)',
    'Popular videos',
    'Live now',
    'Upcoming live streams',
    'Single playlist',
    'Multiple playlists',
    'Subscriptions',
    'Featured channels',
    'Top community clips',
  ];

  const handleNameChange = (value) => {
    setChannelName(value);
    setHasChanges(true);
  };

  const handleHandleChange = (value) => {
    setHandle(value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setHasChanges(true);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setHasChanges(true);
  };

  const handleCopyChannelUrl = () => {
    const url = `https://www.youtube.com/@${handle}`;
    navigator.clipboard.writeText(url);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setLinks([...links, { ...newLink, id: Date.now() }]);
      setNewLink({ title: '', url: '' });
      setShowAddLink(false);
      setHasChanges(true);
    }
  };

  const handleRemoveLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
    setHasChanges(true);
  };

  const handleCancel = () => {
    // Reset all form values to original state
    setChannelName("Tony's Channel");
    setHandle("tonyzhou3956");
    setDescription("");
    setEmail("");
    setLinks([]);
    setHasChanges(false);
  };

  const handlePublish = () => {
    // Simulate publishing changes
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
    setHasChanges(false);
  };

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const handleToggleHomeTab = () => {
    setHomeTabEnabled(!homeTabEnabled);
    setHasChanges(true);
  };

  const handleRemoveSection = (sectionId) => {
    setSections(sections.filter(s => s.id !== sectionId));
    setHasChanges(true);
    setExpandedSection(null);
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-normal text-[#0d0d0d]">Channel customization</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`https://www.youtube.com/@${handle}`, '_blank')}
            className="px-4 py-2 text-[#065fd4] hover:bg-[#f2f2f2] rounded text-sm font-medium"
          >
            View channel
          </button>
          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded text-sm font-medium ${
              hasChanges
                ? 'text-[#065fd4] hover:bg-[#f2f2f2]'
                : 'text-[#aaa] cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded text-sm font-medium ${
              hasChanges
                ? 'bg-[#065fd4] text-white hover:bg-[#0553c2]'
                : 'bg-[#f2f2f2] text-[#aaa] cursor-not-allowed'
            }`}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Saved Message */}
      {showSavedMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#0d0d0d] text-white px-6 py-3 rounded shadow-lg z-50">
          All changes saved
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-[#e5e5e5] mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => navigate('/studio/editing/profile')}
            className={`pb-3 text-sm font-medium relative ${
              activeTab === 'profile'
                ? 'text-[#065fd4]'
                : 'text-[#606060] hover:text-[#0d0d0d]'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#065fd4]"></div>
            )}
          </button>
          <button
            onClick={() => navigate('/studio/editing/hometab')}
            className={`pb-3 text-sm font-medium relative ${
              activeTab === 'home-tab'
                ? 'text-[#065fd4]'
                : 'text-[#606060] hover:text-[#0d0d0d]'
            }`}
          >
            Home tab
            {activeTab === 'home-tab' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#065fd4]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          {/* Banner Image Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Banner image</h2>
            <div className="flex gap-6">
              <div className="w-48 h-28 bg-[#f2f2f2] rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#909090]">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#606060] mb-2">
                  This image will appear across the top of your channel
                </p>
                <p className="text-xs text-[#606060] mb-4">
                  at least 2048 x 1152 pixels and 6MB or less
                </p>
                <button
                  className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
                  onClick={() => handleNotImplemented('Upload banner image')}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Picture Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Picture</h2>
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                T
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#606060] mb-2">
                  Your profile picture will appear where your channel is presented on StreamView
                </p>
                <p className="text-xs text-[#606060] mb-1">
                  at least 98 x 98 pixels and 4MB or less
                </p>
                <p className="text-xs text-[#606060] mb-4">
                  Use a PNG or GIF (no animations) file
                </p>
                <button
                  className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
                  onClick={() => handleNotImplemented('Upload profile picture')}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Name</h2>
            <p className="text-xs text-[#606060] mb-4">
              You can change your name twice in 14 days
            </p>
            <input
              type="text"
              value={channelName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#065fd4]"
            />
          </div>

          {/* Handle Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Handle</h2>
            <p className="text-xs text-[#606060] mb-4">
              Your handle is the unique identifier for your channel
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-[#606060]">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => handleHandleChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#065fd4]"
              />
            </div>
            <p className="text-xs text-[#065fd4]">
              https://www.youtube.com/@{handle}
            </p>
          </div>

          {/* Pronouns Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Pronouns</h2>
            <button
              onClick={() => setShowPronounInterface(!showPronounInterface)}
              className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
            >
              Add pronoun
            </button>
            {showPronounInterface && (
              <div className="mt-4 p-4 border border-[#e5e5e5] rounded">
                <input
                  type="text"
                  placeholder="Search pronouns..."
                  className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3 focus:outline-none focus:border-[#065fd4]"
                />
                <select className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3 focus:outline-none focus:border-[#065fd4]">
                  <option>Filter by language</option>
                  <option>English</option>
                  <option>Spanish</option>
                </select>
                <select className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3 focus:outline-none focus:border-[#065fd4]">
                  <option>Visible to only my subscribers</option>
                  <option>Visible to everyone</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPronounInterface(false)}
                    className="px-4 py-2 text-[#606060] hover:bg-[#f2f2f2] rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowPronounInterface(false)}
                    className="px-4 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0553c2] text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Description</h2>
            <p className="text-xs text-[#606060] mb-4">
              Tell viewers about your channel. Your description will appear in the About section of your channel
            </p>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter channel description"
              rows={5}
              className="w-full px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#065fd4]"
            />
            <button
              onClick={() => setShowAddLanguage(!showAddLanguage)}
              className="mt-3 px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
            >
              Add language
            </button>
            {showAddLanguage && (
              <div className="mt-4 p-4 border border-[#e5e5e5] rounded">
                <select className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3">
                  <option>Select language</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <textarea
                  placeholder="Enter description in selected language"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddLanguage(false)}
                    className="px-4 py-2 text-[#606060] hover:bg-[#f2f2f2] rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAddLanguage(false)}
                    className="px-4 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0553c2] text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Channel URL Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Channel URL</h2>
            <p className="text-xs text-[#606060] mb-4">
              This is the standard web address for your channel. It's based on your channel handle
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={`https://www.youtube.com/@${handle}`}
                readOnly
                className="flex-1 px-3 py-2 border border-[#ccc] rounded text-sm bg-[#f9f9f9] text-[#606060]"
              />
              <button
                onClick={handleCopyChannelUrl}
                className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Links</h2>
            <p className="text-xs text-[#606060] mb-4">
              Add links to your websites and social media profiles to your channel
            </p>
            {links.map((link) => (
              <div key={link.id} className="mb-3 p-3 border border-[#e5e5e5] rounded">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0d0d0d]">{link.title}</p>
                    <p className="text-xs text-[#606060]">{link.url}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    className="text-[#606060] hover:text-[#ff0000]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!showAddLink ? (
              <button
                onClick={() => setShowAddLink(true)}
                className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
              >
                Add link
              </button>
            ) : (
              <div className="mt-4 p-4 border border-[#e5e5e5] rounded">
                <input
                  type="text"
                  placeholder="Link title (required)"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3 focus:outline-none focus:border-[#065fd4]"
                />
                <input
                  type="text"
                  placeholder="URL (required)"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ccc] rounded text-sm mb-3 focus:outline-none focus:border-[#065fd4]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddLink(false);
                      setNewLink({ title: '', url: '' });
                    }}
                    className="px-4 py-2 text-[#606060] hover:bg-[#f2f2f2] rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLink}
                    disabled={!newLink.title || !newLink.url}
                    className={`px-4 py-2 rounded text-sm ${
                      newLink.title && newLink.url
                        ? 'bg-[#065fd4] text-white hover:bg-[#0553c2]'
                        : 'bg-[#f2f2f2] text-[#aaa] cursor-not-allowed'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Contact info</h2>
            <p className="text-xs text-[#606060] mb-4">
              This email address will be visible on your channel's About page
            </p>
            <div>
              <label className="block text-sm font-medium text-[#0d0d0d] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#065fd4]"
              />
            </div>
          </div>

          {/* Video Watermark Section */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-4">Video watermark</h2>
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-[#f2f2f2] rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#909090]">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#606060] mb-2">
                  This image will appear on your videos in the right-hand corner
                </p>
                <p className="text-xs text-[#606060] mb-1">
                  150 x 150 pixels is recommended
                </p>
                <p className="text-xs text-[#606060] mb-1">
                  1MB or less
                </p>
                <p className="text-xs text-[#606060] mb-4">
                  PNG, GIF (no animations), BMP, or JPEG
                </p>
                <button
                  className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
                  onClick={() => handleNotImplemented('Upload video watermark')}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Home Tab */}
      {activeTab === 'home-tab' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h2 className="text-lg font-medium text-[#0d0d0d] mb-2">Home tab</h2>
            <p className="text-sm text-[#606060] mb-4">
              Control what viewers see on your channel's home page
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleHomeTab}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    homeTabEnabled ? 'bg-[#065fd4]' : 'bg-[#ccc]'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      homeTabEnabled ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
                <span className="text-sm text-[#0d0d0d]">
                  {homeTabEnabled ? 'Hide Home Tab' : 'Show Home Tab'}
                </span>
              </div>
            </div>
          </div>

          {/* Layout Section */}
          {homeTabEnabled && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-[#0d0d0d]">Layout</h2>
                <button
                  onClick={() => setShowAddSection(!showAddSection)}
                  className="px-4 py-2 text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f2f2f2] text-sm font-medium"
                >
                  Add section
                </button>
              </div>

              {/* Add Section Menu */}
              {showAddSection && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAddSection(false)}
                  />
                  <div className="absolute right-8 mt-2 bg-white border border-[#e5e5e5] rounded shadow-lg z-50 w-72 max-h-96 overflow-y-auto">
                    {availableSections.map((section, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-3 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
                        onClick={() => {
                          setShowAddSection(false);
                        }}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Section Cards */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border border-[#e5e5e5] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-medium text-[#0d0d0d]">
                        {section.title}
                        {section.count !== null && ` (${section.count})`}
                      </h3>
                      {section.removable && (
                        <div className="relative">
                          <button
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="text-[#606060] hover:bg-[#f2f2f2] p-2 rounded"
                          >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>
                          {expandedSection === section.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setExpandedSection(null)}
                              />
                              <div className="absolute right-0 mt-1 bg-white border border-[#e5e5e5] rounded shadow-lg z-50 w-48">
                                <button
                                  onClick={() => handleRemoveSection(section.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-[#f2f2f2] text-sm text-[#0d0d0d]"
                                >
                                  Remove section
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {section.description && (
                      <p className="text-sm text-[#606060]">{section.description}</p>
                    )}
                    {section.emptyMessage && section.count === 0 && (
                      <p className="text-xs text-[#606060] mt-2 italic">{section.emptyMessage}</p>
                    )}
                    {section.id === 'playlists' && section.count > 0 && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-32 h-20 bg-[#f2f2f2] rounded flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#909090]">
                            <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0d0d0d]">My Playlist</p>
                          <p className="text-xs text-[#606060]">1 video</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disabled State Message */}
          {!homeTabEnabled && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <p className="text-sm text-[#606060] text-center">
                Enable the Home Tab to customize your channel's homepage layout
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
