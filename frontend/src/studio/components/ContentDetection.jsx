import React, { useState } from 'react';

export default function ContentDetection({ onNotImplemented }) {
  const [activeTab, setActiveTab] = useState('copyright');
  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  return (
    <div className="flex-1 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-normal text-[#0f0f0f] mb-6">Content detection</h1>

        {/* Tab Navigation */}
        <div className="border-b border-[#e5e5e5] mb-6">
          <button
            onClick={() => setActiveTab('copyright')}
            className={`px-4 py-3 text-sm font-medium relative ${
              activeTab === 'copyright'
                ? 'text-[#065fd4]'
                : 'text-[#606060] hover:text-[#0f0f0f]'
            }`}
          >
            Copyright
            {activeTab === 'copyright' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#065fd4]"></div>
            )}
          </button>
        </div>

        {/* Copyright Tab Content */}
        {activeTab === 'copyright' && (
          <div className="space-y-8">
            {/* Removal Requests Section */}
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[#0f0f0f]">Removal requests</h2>
                <button
                  className="px-4 py-2 bg-[#065fd4] text-white text-sm font-medium rounded hover:bg-[#0553c2]"
                  onClick={() => handleNotImplemented('Removal requests')}
                >
                  New removal request
                </button>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="w-24 h-24 mx-auto text-[#e5e5e5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13H5v-2h14v2z"/>
                  </svg>
                </div>
                <h3 className="text-base font-medium text-[#0f0f0f] mb-2">Nothing to see yet</h3>
                <p className="text-sm text-[#606060] mb-4">
                  You haven't submitted any copyright takedown requests
                </p>
                <p className="text-sm text-[#606060]">
                  Looking for a copyright claim somebody made on your video?{' '}
                  <a
                    href="#"
                    className="text-[#065fd4] hover:underline"
                    onClick={(event) => {
                      event.preventDefault();
                      handleNotImplemented('Copyright video list');
                    }}
                  >
                    Check the video list
                  </a>
                </p>
                <p className="text-sm text-[#606060] mt-2">
                  <a
                    href="#"
                    className="text-[#065fd4] hover:underline"
                    onClick={(event) => {
                      event.preventDefault();
                      handleNotImplemented('Copyright help');
                    }}
                  >
                    Learn more about copyright takedown requests
                  </a>
                </p>
              </div>
            </div>

            {/* Likeness Detection Section */}
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <h2 className="text-lg font-medium text-[#0f0f0f] mb-3">Likeness Detection</h2>
              <p className="text-sm text-[#606060] mb-4">
                Review content where your likeness may be altered or made with AI
              </p>

              {/* Empty State */}
              <div className="text-center py-8 bg-[#f9f9f9] rounded-lg">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-[#e5e5e5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <p className="text-sm text-[#606060] mb-2">No content detected yet</p>
                <p className="text-xs text-[#909090]">
                  Likeness detection accuracy is constantly improving
                </p>
              </div>
            </div>

            {/* Error Section Example (Optional - for Feature #118) */}
            {false && (
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-[#cc0000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-[#0f0f0f] mb-4">Oops, something went wrong</p>
                  <button className="px-4 py-2 bg-[#065fd4] text-white text-sm font-medium rounded hover:bg-[#0553c2]">
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
