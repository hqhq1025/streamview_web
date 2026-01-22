import { useState } from 'react';
import { useData } from '../../context/DataContext';

function Settings({ isOpen, onClose, onNotImplemented }) {
  const { data, unhideUser, removeModerator, showToast } = useData();
  const [activeTab, setActiveTab] = useState('general');
  const [activeSubTab, setActiveSubTab] = useState('basic-info');

  // Form state
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('United States');
  const [keywords, setKeywords] = useState('');
  const [madeForKids, setMadeForKids] = useState('review-per-video');
  const [disableInterestBasedAds, setDisableInterestBasedAds] = useState(false);
  const [allowClips, setAllowClips] = useState(true);
  const [enhanceVisualQuality, setEnhanceVisualQuality] = useState(true);
  const [enhanceAudioQuality, setEnhanceAudioQuality] = useState(true);
  const [allowAiTraining, setAllowAiTraining] = useState(false);
  const [dontShowInappropriateWords, setDontShowInappropriateWords] = useState(false);

  // Upload defaults state
  const [defaultTitle, setDefaultTitle] = useState('');
  const [defaultDescription, setDefaultDescription] = useState('');
  const [defaultVisibility, setDefaultVisibility] = useState('Public');
  const [defaultTags, setDefaultTags] = useState('');
  const [automaticChapters, setAutomaticChapters] = useState(true);
  const [license, setLicense] = useState('Standard StreamView License');
  const [category, setCategory] = useState('People & Blogs');
  const [videoLanguage, setVideoLanguage] = useState('English (United States)');
  const [captionCertification, setCaptionCertification] = useState('None');
  const [commentsEnabled, setCommentsEnabled] = useState('On');
  const [commentModeration, setCommentModeration] = useState('Basic');
  const [showLikesCount, setShowLikesCount] = useState(true);

  // Community moderation state
  const [communityCommentsEnabled, setCommunityCommentsEnabled] = useState('On');
  const [communityCommentModeration, setCommunityCommentModeration] = useState('Basic');
  const [liveChatModeration, setLiveChatModeration] = useState('Basic');
  const [postsEnabled, setPostsEnabled] = useState('On');
  const [blockedWords, setBlockedWords] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Track initial values to detect changes
  const [initialValues] = useState({
    currency, country, keywords, madeForKids, disableInterestBasedAds,
    allowClips, enhanceVisualQuality, enhanceAudioQuality, allowAiTraining,
    dontShowInappropriateWords, defaultTitle, defaultDescription, defaultVisibility,
    defaultTags, automaticChapters, license, category, videoLanguage,
    captionCertification, commentsEnabled, commentModeration, showLikesCount,
    communityCommentsEnabled, communityCommentModeration, liveChatModeration,
    postsEnabled, blockedWords
  });

  // Check if any values have changed
  const hasChanges =
    currency !== initialValues.currency ||
    country !== initialValues.country ||
    keywords !== initialValues.keywords ||
    madeForKids !== initialValues.madeForKids ||
    disableInterestBasedAds !== initialValues.disableInterestBasedAds ||
    allowClips !== initialValues.allowClips ||
    enhanceVisualQuality !== initialValues.enhanceVisualQuality ||
    enhanceAudioQuality !== initialValues.enhanceAudioQuality ||
    allowAiTraining !== initialValues.allowAiTraining ||
    dontShowInappropriateWords !== initialValues.dontShowInappropriateWords ||
    defaultTitle !== initialValues.defaultTitle ||
    defaultDescription !== initialValues.defaultDescription ||
    defaultVisibility !== initialValues.defaultVisibility ||
    defaultTags !== initialValues.defaultTags ||
    automaticChapters !== initialValues.automaticChapters ||
    license !== initialValues.license ||
    category !== initialValues.category ||
    videoLanguage !== initialValues.videoLanguage ||
    captionCertification !== initialValues.captionCertification ||
    commentsEnabled !== initialValues.commentsEnabled ||
    commentModeration !== initialValues.commentModeration ||
    showLikesCount !== initialValues.showLikesCount ||
    communityCommentsEnabled !== initialValues.communityCommentsEnabled ||
    communityCommentModeration !== initialValues.communityCommentModeration ||
    liveChatModeration !== initialValues.liveChatModeration ||
    postsEnabled !== initialValues.postsEnabled ||
    blockedWords !== initialValues.blockedWords;

  if (!isOpen) return null;

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Japan', 'Brazil', 'India', 'China', 'Spain', 'Italy',
    'Mexico', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland'
  ];

  const categories = [
    'Film & Animation', 'Autos & Vehicles', 'Music', 'Pets & Animals',
    'Sports', 'Travel & Events', 'Gaming', 'People & Blogs',
    'Comedy', 'Entertainment', 'News & Politics', 'Howto & Style',
    'Education', 'Science & Technology', 'Nonprofits & Activism'
  ];

  const languages = [
    'English (United States)', 'English (United Kingdom)', 'Spanish (Spain)',
    'Spanish (Latin America)', 'French', 'German', 'Italian', 'Portuguese (Brazil)',
    'Japanese', 'Korean', 'Chinese (Simplified)', 'Hindi', 'Arabic', 'Russian'
  ];

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'channel', label: 'Channel' },
    { id: 'upload-defaults', label: 'Upload defaults' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'community', label: 'Community' },
    { id: 'agreements', label: 'Agreements' }
  ];

  const channelSubTabs = [
    { id: 'basic-info', label: 'Basic info' },
    { id: 'advanced-settings', label: 'Advanced settings' },
    { id: 'feature-eligibility', label: 'Feature eligibility' }
  ];

  const uploadDefaultsSubTabs = [
    { id: 'basic-info', label: 'Basic info' },
    { id: 'advanced-settings', label: 'Advanced settings' }
  ];

  const communitySubTabs = [
    { id: 'content-controls', label: 'Content Controls' },
    { id: 'user-management', label: 'User management' },
    { id: 'channel-guidelines', label: 'Channel Guidelines' }
  ];

  const handleSave = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardDialog(false);
    onClose();
  };

  const handleDiscardCancel = () => {
    setShowDiscardDialog(false);
  };

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          {currencies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <p className="text-xs text-[#606060] mt-1">
          Choose the currency for displaying revenue reports
        </p>
      </div>
    </div>
  );

  const renderChannelBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Country of residence
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <p className="text-xs text-[#606060] mt-1">
          Your country of residence affects your monetization options
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Keywords
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Add keywords"
          className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
        />
        <p className="text-xs text-[#606060] mt-1">
          Enter comma-separated values
        </p>
      </div>
    </div>
  );

  const renderChannelAdvancedSettings = () => (
    <div className="space-y-8">
      {/* Audience - Made for Kids */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Audience</h3>
        <p className="text-sm text-[#606060] mb-4">
          Regardless of your location, you're legally required to comply with the Children's Online Privacy Protection Act (COPPA) and/or other laws. You're required to tell us whether your videos are made for kids.
        </p>
        <div className="space-y-2">
          <label className="flex items-start">
            <input
              type="radio"
              name="madeForKids"
              value="yes"
              checked={madeForKids === 'yes'}
              onChange={(e) => setMadeForKids(e.target.value)}
              className="mt-1 mr-2"
            />
            <div>
              <div className="text-sm text-[#0d0d0d]">Yes, set this channel as made for kids</div>
              <div className="text-xs text-[#606060]">I always upload content that's made for kids</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="radio"
              name="madeForKids"
              value="no"
              checked={madeForKids === 'no'}
              onChange={(e) => setMadeForKids(e.target.value)}
              className="mt-1 mr-2"
            />
            <div>
              <div className="text-sm text-[#0d0d0d]">No, set this channel as not made for kids</div>
              <div className="text-xs text-[#606060]">I never upload content that's made for kids</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="radio"
              name="madeForKids"
              value="review-per-video"
              checked={madeForKids === 'review-per-video'}
              onChange={(e) => setMadeForKids(e.target.value)}
              className="mt-1 mr-2"
            />
            <div>
              <div className="text-sm text-[#0d0d0d]">I want to review this setting for every video</div>
              <div className="text-xs text-[#606060]">Some of my content is made for kids, and some isn't</div>
            </div>
          </label>
        </div>
      </div>

      {/* Google Ads Account Linking */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Google Ads account linking</h3>
        <p className="text-sm text-[#606060] mb-3">
          Link your StreamView channel to a Google Ads account to promote your channel and videos with ads.
        </p>
        <button
          className="px-4 py-2 bg-[#065fd4] text-white text-sm rounded hover:bg-[#0553c2]"
          onClick={() => handleNotImplemented('Google Ads linking')}
        >
          Link account
        </button>
      </div>

      {/* Automatic Captions */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Automatic captions</h3>
        <p className="text-sm text-[#606060] mb-3">
          StreamView automatically generates captions for your videos. Automatic captions can make mistakes, so review them before publishing.
        </p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={dontShowInappropriateWords}
            onChange={(e) => setDontShowInappropriateWords(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-[#0d0d0d]">Don't show potentially inappropriate words</span>
        </label>
      </div>

      {/* Automatic Dubbing */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Automatic dubbing</h3>
        <p className="text-sm text-[#606060] mb-3">
          Early access feature: StreamView can automatically dub your videos into multiple languages using AI.
        </p>
        <button
          className="px-4 py-2 border border-[#ccc] text-[#0d0d0d] text-sm rounded hover:bg-[#f2f2f2]"
          onClick={() => handleNotImplemented('Automatic dubbing')}
        >
          Enable
        </button>
      </div>

      {/* Advertisements */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Advertisements</h3>
        <p className="text-sm text-[#606060] mb-3">
          You can choose to disable interest-based advertising. This may reduce your revenue.
        </p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={disableInterestBasedAds}
            onChange={(e) => setDisableInterestBasedAds(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-[#0d0d0d]">Disable interest-based ads</span>
        </label>
        {disableInterestBasedAds && (
          <p className="text-xs text-[#d93025] mt-2">
            Warning: Disabling interest-based ads may reduce your revenue
          </p>
        )}
      </div>

      {/* Clips */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Clips</h3>
        <p className="text-sm text-[#606060] mb-3">
          Allow your viewers to create and share clips from your videos.
        </p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={allowClips}
            onChange={(e) => setAllowClips(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-[#0d0d0d]">Allow viewers to clip my content</span>
        </label>
      </div>

      {/* Video Quality Enhancements */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Video quality enhancements</h3>
        <p className="text-sm text-[#606060] mb-3">
          StreamView can enhance the visual and audio quality of your videos.
        </p>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enhanceVisualQuality}
              onChange={(e) => setEnhanceVisualQuality(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-[#0d0d0d]">Let StreamView enhance visual quality</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enhanceAudioQuality}
              onChange={(e) => setEnhanceAudioQuality(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-[#0d0d0d]">Let StreamView enhance audio quality</span>
          </label>
        </div>
        <a href="#" className="text-xs text-[#065fd4] hover:underline mt-2 inline-block">
          Learn more
        </a>
      </div>

      {/* Third-party AI Training */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Third-party training</h3>
        <p className="text-sm text-[#606060] mb-3">
          Control whether third-party companies can train AI models using your channel content.
        </p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={allowAiTraining}
            onChange={(e) => setAllowAiTraining(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-[#0d0d0d]">
            Allow third-party companies to train AI models using my channel content
          </span>
        </label>
      </div>
    </div>
  );

  const renderChannelFeatureEligibility = () => (
    <div className="space-y-6">
      {/* Standard Features */}
      <div className="border border-[#e5e5e5] rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[#0d0d0d]">Standard features</h3>
          <span className="px-3 py-1 bg-[#e8f5e9] text-[#1e8e3e] text-xs rounded">Enabled</span>
        </div>
        <p className="text-xs text-[#606060]">
          Available to all channels
        </p>
      </div>

      {/* Intermediate Features */}
      <div className="border border-[#e5e5e5] rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[#0d0d0d]">Intermediate features</h3>
          <span className="px-3 py-1 bg-[#e3f2fd] text-[#1967d2] text-xs rounded">Eligible</span>
        </div>
        <p className="text-xs text-[#606060]">
          Requires phone verification
        </p>
      </div>

      {/* Advanced Features */}
      <div className="border border-[#e5e5e5] rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[#0d0d0d]">Advanced features</h3>
          <span className="px-3 py-1 bg-[#e3f2fd] text-[#1967d2] text-xs rounded">Eligible</span>
        </div>
        <p className="text-xs text-[#606060]">
          Requires ID verification
        </p>
      </div>
    </div>
  );

  const renderUploadDefaultsBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Title
        </label>
        <input
          type="text"
          value={defaultTitle}
          onChange={(e) => setDefaultTitle(e.target.value)}
          placeholder="Add a title that describes your video"
          className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Description
        </label>
        <textarea
          value={defaultDescription}
          onChange={(e) => setDefaultDescription(e.target.value)}
          placeholder="Tell viewers about your video"
          rows={5}
          className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Visibility
        </label>
        <select
          value={defaultVisibility}
          onChange={(e) => setDefaultVisibility(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          <option value="Public">Public</option>
          <option value="Unlisted">Unlisted</option>
          <option value="Private">Private</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Tags
        </label>
        <input
          type="text"
          value={defaultTags}
          onChange={(e) => setDefaultTags(e.target.value)}
          placeholder="Add tags"
          className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
        />
        <p className="text-xs text-[#606060] mt-1">
          Enter comma-separated tags
        </p>
      </div>
    </div>
  );

  const renderUploadDefaultsAdvancedSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={automaticChapters}
            onChange={(e) => setAutomaticChapters(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-[#0d0d0d]">Allow automatic chapters</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          License
        </label>
        <select
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          <option value="Standard StreamView License">Standard StreamView License</option>
          <option value="Creative Commons - Attribution">Creative Commons - Attribution</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Video language
        </label>
        <select
          value={videoLanguage}
          onChange={(e) => setVideoLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          Caption certification
        </label>
        <select
          value={captionCertification}
          onChange={(e) => setCaptionCertification(e.target.value)}
          className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
        >
          <option value="None">None</option>
          <option value="Professional">Professional</option>
        </select>
      </div>

      {/* Comments Section */}
      <div className="border-t border-[#e5e5e5] pt-6">
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-4">Comments</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
              Comments
            </label>
            <select
              value={commentsEnabled}
              onChange={(e) => setCommentsEnabled(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
            >
              <option value="On">On</option>
              <option value="Off">Off</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
              Moderation
            </label>
            <select
              value={commentModeration}
              onChange={(e) => setCommentModeration(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
            >
              <option value="Basic">Basic</option>
              <option value="Strict">Strict</option>
              <option value="Hold all">Hold all</option>
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showLikesCount}
                onChange={(e) => setShowLikesCount(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-[#0d0d0d]">Show how many viewers like this video</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const handleUnhideUser = async (userId) => {
    try {
      await unhideUser(userId);
      showToast('User unhidden');
    } catch (err) {
      console.error(err);
      showToast('Failed to unhide user');
    }
  };

  const handleRemoveModerator = async (userId, type) => {
    try {
      await removeModerator(userId, type);
      showToast('Moderator removed');
    } catch (err) {
      console.error(err);
      showToast('Failed to remove moderator');
    }
  };

  const renderPermissionsTab = () => {
    const channelOwner = data?.user || { displayName: 'Alex Thompson', email: 'alex@example.com' };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">
            Permissions for {channelOwner.displayName}
          </h3>
          <p className="text-sm text-[#606060] mb-4">
            Manage who has access to your channel. You can invite other users and assign them specific roles.
          </p>
          <button
            className="px-4 py-2 bg-[#065fd4] text-white text-sm rounded hover:bg-[#0553c2]"
            onClick={() => handleNotImplemented('Invite user')}
          >
            Invite
          </button>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#0d0d0d] mb-3">Channel members</h4>
          <div className="border border-[#e5e5e5] rounded">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#606060]">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#606060]">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5e5e5] last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#065fd4] text-white flex items-center justify-center font-medium">
                        {channelOwner.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#0d0d0d]">{channelOwner.displayName}</div>
                        <div className="text-xs text-[#606060]">{channelOwner.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#0d0d0d]">Owner</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCommunityContentControls = () => (
    <div className="space-y-8">
      {/* Comments on new videos and posts */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-4">Comments on new videos and posts</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
              Comments
            </label>
            <select
              value={communityCommentsEnabled}
              onChange={(e) => setCommunityCommentsEnabled(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
            >
              <option value="On">On</option>
              <option value="Off">Off</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
              Moderation
            </label>
            <select
              value={communityCommentModeration}
              onChange={(e) => setCommunityCommentModeration(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
            >
              <option value="Basic">Basic</option>
              <option value="Strict">Strict</option>
              <option value="Hold all">Hold all</option>
            </select>
            <p className="text-xs text-[#606060] mt-1">
              StreamView will hold comments that may be inappropriate for review
            </p>
          </div>
        </div>
      </div>

      {/* Messages in your live chat */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-4">Messages in your live chat</h3>
        <div>
          <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
            Moderation
          </label>
          <select
            value={liveChatModeration}
            onChange={(e) => setLiveChatModeration(e.target.value)}
            className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
          >
            <option value="Basic">Basic</option>
            <option value="Strict">Strict</option>
            <option value="Hold all">Hold all</option>
          </select>
          <p className="text-xs text-[#606060] mt-1">
            StreamView will hold messages that may be inappropriate for review
          </p>
        </div>
      </div>

      {/* Community posts */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-4">Community posts</h3>
        <div>
          <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
            Posts
          </label>
          <select
            value={postsEnabled}
            onChange={(e) => setPostsEnabled(e.target.value)}
            className="w-full px-3 py-2 border border-[#ccc] rounded bg-white text-sm"
          >
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
        </div>
      </div>

      {/* Blocked words */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-4">Blocked words</h3>
        <textarea
          value={blockedWords}
          onChange={(e) => setBlockedWords(e.target.value)}
          placeholder="Enter words to block, separated by commas"
          rows={4}
          className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
        />
        <p className="text-xs text-[#606060] mt-1">
          Comments containing these words will be held for review
        </p>
      </div>
    </div>
  );

  const renderCommunityUserManagement = () => {
    const userManagement = data?.userManagement || {};
    const hiddenUsers = userManagement.hiddenUsers || [];
    const managingModerators = userManagement.managingModerators || [];
    const standardModerators = userManagement.standardModerators || [];

    return (
      <div className="space-y-8">
        {/* Managing Moderators */}
        <div>
          <h3 className="text-sm font-medium text-[#0d0d0d] mb-2">Managing moderators</h3>
          <p className="text-xs text-[#606060] mb-4">
            Managing moderators can view comments, remove comments, hide users, and add other moderators.
          </p>
          {managingModerators.length > 0 ? (
            <div className="border border-[#e5e5e5] rounded divide-y divide-[#e5e5e5]">
              {managingModerators.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.userAvatar || 'https://www.gravatar.com/avatar/?d=mp'}
                      alt={user.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-[#0d0d0d]">{user.userName}</div>
                      <div className="text-xs text-[#606060]">Added {new Date(user.addedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveModerator(user.userId, 'managing')}
                    className="text-sm text-[#606060] hover:text-[#d93025]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-[#e5e5e5] rounded text-sm text-[#606060]">
              No managing moderators yet
            </div>
          )}
        </div>

        {/* Standard Moderators */}
        <div>
          <h3 className="text-sm font-medium text-[#0d0d0d] mb-2">Standard moderators</h3>
          <p className="text-xs text-[#606060] mb-4">
            Standard moderators can view comments, remove comments, and hide users.
          </p>
          {standardModerators.length > 0 ? (
            <div className="border border-[#e5e5e5] rounded divide-y divide-[#e5e5e5]">
              {standardModerators.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.userAvatar || 'https://www.gravatar.com/avatar/?d=mp'}
                      alt={user.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-[#0d0d0d]">{user.userName}</div>
                      <div className="text-xs text-[#606060]">Added {new Date(user.addedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveModerator(user.userId, 'standard')}
                    className="text-sm text-[#606060] hover:text-[#d93025]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-[#e5e5e5] rounded text-sm text-[#606060]">
              No standard moderators yet
            </div>
          )}
        </div>

        {/* Hidden Users */}
        <div>
          <h3 className="text-sm font-medium text-[#0d0d0d] mb-2">Hidden users</h3>
          <p className="text-xs text-[#606060] mb-4">
            Hidden users cannot comment on your videos. Their previous comments have been removed.
          </p>
          {hiddenUsers.length > 0 ? (
            <div className="border border-[#e5e5e5] rounded divide-y divide-[#e5e5e5]">
              {hiddenUsers.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.userAvatar || 'https://www.gravatar.com/avatar/?d=mp'}
                      alt={user.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-[#0d0d0d]">{user.userName}</div>
                      <div className="text-xs text-[#606060]">Hidden {new Date(user.hiddenAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnhideUser(user.userId)}
                    className="text-sm text-[#065fd4] hover:text-[#0450b4]"
                  >
                    Unhide
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-[#e5e5e5] rounded text-sm text-[#606060]">
              No hidden users
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCommunityChannelGuidelines = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Channel guidelines</h3>
        <p className="text-sm text-[#606060] mb-4">
          Set guidelines for your community to help them understand what content is acceptable on your channel.
        </p>
        <textarea
          placeholder="Enter your channel guidelines"
          rows={8}
          className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
        />
        <p className="text-xs text-[#606060] mt-2">
          Note: You must verify your channel to publish guidelines
        </p>
      </div>

      <div>
        <button
          className="px-4 py-2 border border-[#ccc] text-[#0d0d0d] text-sm rounded hover:bg-[#f2f2f2]"
          onClick={() => handleNotImplemented('Channel verification')}
        >
          Verify channel
        </button>
      </div>

      {/* Live redirect */}
      <div>
        <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">Live redirect</h3>
        <p className="text-sm text-[#606060] mb-4">
          Automatically redirect viewers to a different stream when you're not live.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
              Redirect to channel
            </label>
            <input
              type="text"
              placeholder="Enter channel URL"
              className="w-full px-3 py-2 border border-[#ccc] rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'general') {
      return renderGeneralTab();
    }

    if (activeTab === 'channel') {
      if (activeSubTab === 'basic-info') {
        return renderChannelBasicInfo();
      } else if (activeSubTab === 'advanced-settings') {
        return renderChannelAdvancedSettings();
      } else if (activeSubTab === 'feature-eligibility') {
        return renderChannelFeatureEligibility();
      }
    }

    if (activeTab === 'upload-defaults') {
      if (activeSubTab === 'basic-info') {
        return renderUploadDefaultsBasicInfo();
      } else if (activeSubTab === 'advanced-settings') {
        return renderUploadDefaultsAdvancedSettings();
      }
    }

    if (activeTab === 'permissions') {
      return renderPermissionsTab();
    }

    if (activeTab === 'community') {
      if (activeSubTab === 'content-controls') {
        return renderCommunityContentControls();
      } else if (activeSubTab === 'user-management') {
        return renderCommunityUserManagement();
      } else if (activeSubTab === 'channel-guidelines') {
        return renderCommunityChannelGuidelines();
      }
    }

    if (activeTab === 'agreements') {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-[#0d0d0d] mb-3">StreamView Terms of Service</h3>
            <p className="text-sm text-[#606060] mb-4">
              By using StreamView, you agree to the Terms of Service. These terms outline the rules and regulations for using StreamView and StreamView Studio.
            </p>
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#065fd4] hover:underline"
            >
              Learn more about StreamView Terms of Service
            </a>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'channel') {
      setActiveSubTab('basic-info');
    } else if (tabId === 'upload-defaults') {
      setActiveSubTab('basic-info');
    } else if (tabId === 'community') {
      setActiveSubTab('content-controls');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-medium text-[#0d0d0d]">Settings</h2>
            <button
              onClick={onClose}
              className="text-[#606060] hover:text-[#0d0d0d] p-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mx-6 mt-4 px-4 py-3 bg-[#e6f4ea] border-l-4 border-[#1e8e3e] text-[#1e8e3e] text-sm">
              All changes saved
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-[#e5e5e5] px-6">
            <div className="flex space-x-6 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-1 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-[#065fd4] text-[#065fd4]'
                      : 'border-transparent text-[#606060] hover:text-[#0d0d0d]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tabs (for Channel, Upload Defaults, and Community) */}
          {(activeTab === 'channel' || activeTab === 'upload-defaults' || activeTab === 'community') && (
            <div className="border-b border-[#e5e5e5] px-6 bg-[#f9f9f9]">
              <div className="flex space-x-6 -mb-px">
                {(activeTab === 'channel' ? channelSubTabs : activeTab === 'upload-defaults' ? uploadDefaultsSubTabs : communitySubTabs).map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveSubTab(subTab.id)}
                    className={`px-1 py-2 text-xs font-medium border-b-2 ${
                      activeSubTab === subTab.id
                        ? 'border-[#065fd4] text-[#065fd4]'
                        : 'border-transparent text-[#606060] hover:text-[#0d0d0d]'
                    }`}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e5e5]">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm text-[#065fd4] hover:bg-[#f2f2f2] rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 text-sm rounded transition-colors ${
                hasChanges
                  ? 'bg-[#065fd4] text-white hover:bg-[#0553c2] cursor-pointer'
                  : 'bg-[#e5e5e5] text-[#909090] cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Discard changes confirmation dialog */}
      {showDiscardDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-96">
            <div className="p-6">
              <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Discard changes?</h3>
              <p className="text-sm text-[#606060] mb-6">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDiscardCancel}
                  className="px-4 py-2 text-sm text-[#065fd4] hover:bg-[#f2f2f2] rounded"
                >
                  Keep editing
                </button>
                <button
                  onClick={handleDiscardConfirm}
                  className="px-4 py-2 text-sm bg-[#065fd4] text-white rounded hover:bg-[#0553c2]"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
