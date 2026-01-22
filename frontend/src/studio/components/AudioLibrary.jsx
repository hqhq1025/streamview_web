import { useState, useMemo } from 'react';

// Mock audio library data
const mockAudioTracks = [
  { id: 1, title: 'Summer Vibes', genre: 'Pop', mood: 'Happy', artist: 'Audio Library', duration: '2:45', license: 'StreamView Audio Library', addedDate: '2024-01-15', starred: false, type: 'music', category: null },
  { id: 2, title: 'Chill Beats', genre: 'Hip-Hop & Rap', mood: 'Calm', artist: 'Beat Makers', duration: '3:20', license: 'StreamView Audio Library', addedDate: '2024-01-10', starred: false, type: 'music', category: null },
  { id: 3, title: 'Uplifting Energy', genre: 'Electronic', mood: 'Bright', artist: 'Synth Masters', duration: '2:15', license: 'StreamView Audio Library', addedDate: '2024-01-05', starred: false, type: 'music', category: null },
  { id: 4, title: 'Acoustic Dreams', genre: 'Folk', mood: 'Calm', artist: 'Guitar Stories', duration: '3:45', license: 'StreamView Audio Library', addedDate: '2024-01-20', starred: false, type: 'music', category: null },
  { id: 5, title: 'Night Drive', genre: 'R&B', mood: 'Funky', artist: 'Groove Gang', duration: '3:10', license: 'StreamView Audio Library', addedDate: '2024-01-12', starred: false, type: 'music', category: null },
  { id: 6, title: 'Mountain Echo', genre: 'Ambient', mood: 'Calm', artist: 'Nature Sounds', duration: '4:30', license: 'StreamView Audio Library', addedDate: '2024-01-08', starred: false, type: 'music', category: null },
  { id: 7, title: 'Rock Anthem', genre: 'Rock', mood: 'Energetic', artist: 'Power Chords', duration: '3:55', license: 'StreamView Audio Library', addedDate: '2024-01-18', starred: false, type: 'music', category: null },
  { id: 8, title: 'Jazz Evening', genre: 'Jazz', mood: 'Calm', artist: 'Smooth Jazz Trio', duration: '4:15', license: 'StreamView Audio Library', addedDate: '2024-01-14', starred: false, type: 'music', category: null },
  // Sound effects with proper categories
  { id: 9, title: 'Forest Birds', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:30', license: 'StreamView Audio Library', addedDate: '2024-01-01', starred: false, type: 'sound-effect', category: 'Ambiences' },
  { id: 10, title: 'City Street', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:45', license: 'StreamView Audio Library', addedDate: '2024-01-01', starred: false, type: 'sound-effect', category: 'Ambiences' },
  { id: 11, title: 'Ocean Waves', genre: 'Sound Effects', mood: 'Calm', artist: 'Sound Effects', duration: '1:00', license: 'StreamView Audio Library', addedDate: '2024-01-01', starred: false, type: 'sound-effect', category: 'Ambiences' },
  { id: 12, title: 'Car Engine Start', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:03', license: 'StreamView Audio Library', addedDate: '2024-01-02', starred: false, type: 'sound-effect', category: 'Transportation' },
  { id: 13, title: 'Train Horn', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:02', license: 'StreamView Audio Library', addedDate: '2024-01-02', starred: false, type: 'sound-effect', category: 'Transportation' },
  { id: 14, title: 'Airplane Takeoff', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:15', license: 'StreamView Audio Library', addedDate: '2024-01-02', starred: false, type: 'sound-effect', category: 'Transportation' },
  { id: 15, title: 'Boing Spring', genre: 'Sound Effects', mood: 'Happy', artist: 'Sound Effects', duration: '0:01', license: 'StreamView Audio Library', addedDate: '2024-01-03', starred: false, type: 'sound-effect', category: 'Cartoon' },
  { id: 16, title: 'Slip Whistle', genre: 'Sound Effects', mood: 'Happy', artist: 'Sound Effects', duration: '0:02', license: 'StreamView Audio Library', addedDate: '2024-01-03', starred: false, type: 'sound-effect', category: 'Cartoon' },
  { id: 17, title: 'Pop Bubble', genre: 'Sound Effects', mood: 'Happy', artist: 'Sound Effects', duration: '0:01', license: 'StreamView Audio Library', addedDate: '2024-01-03', starred: false, type: 'sound-effect', category: 'Cartoon' },
  { id: 18, title: 'Dog Bark', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:02', license: 'StreamView Audio Library', addedDate: '2024-01-04', starred: false, type: 'sound-effect', category: 'Animals' },
  { id: 19, title: 'Cat Meow', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:01', license: 'StreamView Audio Library', addedDate: '2024-01-04', starred: false, type: 'sound-effect', category: 'Animals' },
  { id: 20, title: 'Horse Neigh', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:03', license: 'StreamView Audio Library', addedDate: '2024-01-04', starred: false, type: 'sound-effect', category: 'Animals' },
  { id: 21, title: 'Creepy Door', genre: 'Sound Effects', mood: 'Dark', artist: 'Sound Effects', duration: '0:05', license: 'StreamView Audio Library', addedDate: '2024-01-05', starred: false, type: 'sound-effect', category: 'Horror' },
  { id: 22, title: 'Scream', genre: 'Sound Effects', mood: 'Dark', artist: 'Sound Effects', duration: '0:02', license: 'StreamView Audio Library', addedDate: '2024-01-05', starred: false, type: 'sound-effect', category: 'Horror' },
  { id: 23, title: 'Thunder Crack', genre: 'Sound Effects', mood: 'Dark', artist: 'Sound Effects', duration: '0:04', license: 'StreamView Audio Library', addedDate: '2024-01-05', starred: false, type: 'sound-effect', category: 'Horror' },
  { id: 24, title: 'Hammer Hit', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:01', license: 'StreamView Audio Library', addedDate: '2024-01-06', starred: false, type: 'sound-effect', category: 'Tools' },
  { id: 25, title: 'Drill Sound', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:03', license: 'StreamView Audio Library', addedDate: '2024-01-06', starred: false, type: 'sound-effect', category: 'Tools' },
  { id: 26, title: 'Saw Cutting', genre: 'Sound Effects', mood: 'Neutral', artist: 'Sound Effects', duration: '0:05', license: 'StreamView Audio Library', addedDate: '2024-01-06', starred: false, type: 'sound-effect', category: 'Tools' },
];

const genres = ['All', 'Hip-Hop & Rap', 'R&B', 'Pop', 'Rock', 'Ambient', 'Electronic', 'Folk', 'Jazz'];
const soundEffectCategories = ['All', 'Ambiences', 'Transportation', 'Cartoon', 'Animals', 'Horror', 'Tools'];
const moods = ['Calm', 'Sad', 'Funky', 'Bright', 'Happy', 'Dark', 'Energetic'];

export default function AudioLibrary() {
  const [activeTab, setActiveTab] = useState('music');
  const [tracks, setTracks] = useState(mockAudioTracks);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter tracks based on active tab and filters
  const filteredTracks = useMemo(() => {
    let result = tracks;

    // Filter by tab type
    if (activeTab === 'music') {
      result = result.filter(t => t.type === 'music');
    } else if (activeTab === 'sound-effects') {
      result = result.filter(t => t.type === 'sound-effect');
    } else if (activeTab === 'starred') {
      result = result.filter(t => t.starred);
    }

    // Filter by genre (for music)
    if (selectedGenre !== 'All' && activeTab === 'music') {
      result = result.filter(t => t.genre === selectedGenre);
    }

    // Filter by category (for sound effects)
    if (selectedCategory !== 'All' && activeTab === 'sound-effects') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Filter by moods
    if (selectedMoods.length > 0) {
      result = result.filter(t => selectedMoods.includes(t.mood));
    }

    // Filter by search text
    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.artist.toLowerCase().includes(search) ||
        t.mood.toLowerCase().includes(search) ||
        t.genre.toLowerCase().includes(search) ||
        (t.category && t.category.toLowerCase().includes(search))
      );
    }

    return result;
  }, [tracks, activeTab, selectedGenre, selectedCategory, selectedMoods, searchText]);

  // Paginated tracks
  const paginatedTracks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTracks.slice(startIndex, endIndex);
  }, [filteredTracks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);

  const handleToggleStar = (trackId) => {
    setTracks(prevTracks =>
      prevTracks.map(t =>
        t.id === trackId ? { ...t, starred: !t.starred } : t
      )
    );
    // Show "All changes saved" message
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

  // Reset to page 1 when filters change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePlayPause = (trackId) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };

  const handleRemoveGenreFilter = () => {
    setSelectedGenre('All');
  };

  const handleRemoveCategoryFilter = () => {
    setSelectedCategory('All');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedGenre('All');
    setSelectedCategory('All');
    setSearchText('');
  };

  const handleApplyMoodFilter = () => {
    setShowMoodDialog(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleMood = (mood) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleRemoveMoodFilter = () => {
    setSelectedMoods([]);
  };

  const handleDownload = (track) => {
    console.log('Downloading track:', track.title);
    // In a real app, this would trigger a download
  };

  return (
    <div className="p-8 bg-[#f9f9f9] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#0d0d0d] mb-2">Audio Library</h1>
        <p className="text-[#606060] text-sm">Download free music and sound effects for your videos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#e5e5e5] mb-6">
        <button
          onClick={() => handleTabChange('music')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'music'
              ? 'border-[#065fd4] text-[#065fd4]'
              : 'border-transparent text-[#606060] hover:text-[#0d0d0d]'
          }`}
        >
          Music
        </button>
        <button
          onClick={() => handleTabChange('sound-effects')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sound-effects'
              ? 'border-[#065fd4] text-[#065fd4]'
              : 'border-transparent text-[#606060] hover:text-[#0d0d0d]'
          }`}
        >
          Sound effects
        </button>
        <button
          onClick={() => handleTabChange('starred')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'starred'
              ? 'border-[#065fd4] text-[#065fd4]'
              : 'border-transparent text-[#606060] hover:text-[#0d0d0d]'
          }`}
        >
          Starred
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded border border-[#e5e5e5] p-4 mb-4">
        {/* Search box */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search by title, mood, artist, duration, or license type"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border border-[#ccc] rounded text-sm focus:outline-none focus:border-[#065fd4]"
          />
          <button
            onClick={() => setShowMoodDialog(true)}
            className="absolute right-2 top-2 text-[#065fd4] text-sm hover:underline"
          >
            Filters
          </button>
        </div>

        {/* Genre/Category filter buttons */}
        {activeTab === 'music' && (
          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedGenre === genre
                    ? 'bg-[#065fd4] text-white border-[#065fd4]'
                    : 'bg-white text-[#606060] border-[#ccc] hover:border-[#606060]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
        {activeTab === 'sound-effects' && (
          <div className="flex flex-wrap gap-2 mb-3">
            {soundEffectCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#065fd4] text-white border-[#065fd4]'
                    : 'bg-white text-[#606060] border-[#ccc] hover:border-[#606060]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Active filters display */}
        {(selectedGenre !== 'All' || selectedCategory !== 'All' || selectedMoods.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedGenre !== 'All' && activeTab === 'music' && (
              <div className="flex items-center gap-2 bg-[#e8f0fe] text-[#065fd4] px-3 py-1 rounded-full text-sm">
                <span>Genre: {selectedGenre}</span>
                <button
                  onClick={handleRemoveGenreFilter}
                  className="text-[#065fd4] hover:text-[#0553c2]"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </button>
              </div>
            )}
            {selectedCategory !== 'All' && activeTab === 'sound-effects' && (
              <div className="flex items-center gap-2 bg-[#e8f0fe] text-[#065fd4] px-3 py-1 rounded-full text-sm">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={handleRemoveCategoryFilter}
                  className="text-[#065fd4] hover:text-[#0553c2]"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </button>
              </div>
            )}
            {selectedMoods.map(mood => (
              <div key={mood} className="flex items-center gap-2 bg-[#e8f0fe] text-[#065fd4] px-3 py-1 rounded-full text-sm">
                <span>Mood: {mood}</span>
                <button
                  onClick={() => handleToggleMood(mood)}
                  className="text-[#065fd4] hover:text-[#0553c2]"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </button>
              </div>
            ))}
            {selectedMoods.length > 0 && (
              <button
                onClick={handleRemoveMoodFilter}
                className="text-[#065fd4] text-sm hover:underline"
              >
                Clear all mood filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Save confirmation message */}
      {showSaveMessage && (
        <div className="fixed top-20 right-8 bg-[#0d0d0d] text-white px-4 py-2 rounded shadow-lg z-50">
          All changes saved
        </div>
      )}

      {/* Track list */}
      {activeTab === 'starred' && filteredTracks.length === 0 ? (
        <div className="bg-white rounded border border-[#e5e5e5] p-12 text-center">
          <p className="text-[#606060] text-sm">
            When you star audio tracks they'll appear here for you to find them easily.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded border border-[#e5e5e5] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">Track</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">
                  {activeTab === 'sound-effects' ? 'Category' : 'Genre'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">Mood</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">Artist</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">License</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">Added</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#606060] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTracks.map((track) => (
                <tr key={track.id} className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePlayPause(track.id)}
                        className="w-8 h-8 rounded-full bg-[#065fd4] hover:bg-[#0553c2] flex items-center justify-center"
                      >
                        {playingTrackId === track.id ? (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                            <path d="M6 6h4v12H6zm8 0h4v12h-4z"></path>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                            <path d="M8 5v14l11-7z"></path>
                          </svg>
                        )}
                      </button>
                      <span className="text-sm text-[#0d0d0d] font-medium">{track.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#606060]">
                    {activeTab === 'sound-effects' ? track.category : track.genre}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#606060]">{track.mood}</td>
                  <td className="px-4 py-3 text-sm text-[#606060]">{track.artist}</td>
                  <td className="px-4 py-3 text-sm text-[#606060]">{track.duration}</td>
                  <td className="px-4 py-3 text-sm text-[#606060]">{track.license}</td>
                  <td className="px-4 py-3 text-sm text-[#606060]">{track.addedDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStar(track.id)}
                        className="p-1 hover:bg-[#f2f2f2] rounded"
                        title={track.starred ? 'Remove star' : 'Add star'}
                      >
                        {track.starred ? (
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#f9ab00]">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#909090]">
                            <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(track)}
                        className="p-1 hover:bg-[#f2f2f2] rounded"
                        title="Download"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                          <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTracks.length === 0 && activeTab !== 'starred' && (
            <div className="p-12 text-center">
              <p className="text-[#606060] text-sm">No tracks found matching your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination controls and result counter */}
      {filteredTracks.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-[#606060]">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTracks.length)}-{Math.min(currentPage * itemsPerPage, filteredTracks.length)} of {filteredTracks.length} tracks
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm rounded border ${
                  currentPage === 1
                    ? 'bg-[#f9f9f9] text-[#ccc] border-[#e5e5e5] cursor-not-allowed'
                    : 'bg-white text-[#606060] border-[#ccc] hover:bg-[#f9f9f9]'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-[#606060]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm rounded border ${
                  currentPage === totalPages
                    ? 'bg-[#f9f9f9] text-[#ccc] border-[#e5e5e5] cursor-not-allowed'
                    : 'bg-white text-[#606060] border-[#ccc] hover:bg-[#f9f9f9]'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mood filter dialog */}
      {showMoodDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[#0d0d0d]">Filter by mood</h2>
                <button
                  onClick={() => setShowMoodDialog(false)}
                  className="p-1 hover:bg-[#f2f2f2] rounded"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {moods.map(mood => (
                  <label key={mood} className="flex items-center gap-3 p-2 hover:bg-[#f9f9f9] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMoods.includes(mood)}
                      onChange={() => handleToggleMood(mood)}
                      className="w-4 h-4 text-[#065fd4] border-[#ccc] rounded focus:ring-[#065fd4]"
                    />
                    <span className="text-sm text-[#0d0d0d]">{mood}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyMoodFilter}
                  className="flex-1 px-4 py-2 bg-[#065fd4] text-white rounded hover:bg-[#0553c2] text-sm font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setSelectedMoods([]);
                    setShowMoodDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-white text-[#606060] border border-[#ccc] rounded hover:bg-[#f9f9f9] text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
