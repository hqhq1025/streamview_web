import React, { useState } from 'react';

export default function LiveStreaming({ onNotImplemented }) {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [overlaySelection, setOverlaySelection] = useState(null);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === 'function') {
      onNotImplemented(feature);
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRequestAccess = () => {
    showToastMessage('Request submitted successfully. You will be notified within 24 hours.');
  };

  const handleOpenSettings = () => {
    setShowSettingsDialog(true);
    setOverlaySelection(null);
  };

  const handleCloseSettings = () => {
    if (overlaySelection) {
      setShowDiscardConfirmation(true);
    } else {
      setShowSettingsDialog(false);
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirmation(false);
    setShowSettingsDialog(false);
    setOverlaySelection(null);
  };

  const handleCancelDiscard = () => {
    setShowDiscardConfirmation(false);
  };

  const handleSaveSettings = () => {
    handleNotImplemented('Save overlay settings');
    setShowSettingsDialog(false);
    setOverlaySelection(null);
  };

  const handleOpenFeedback = () => {
    setShowFeedbackDialog(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackDialog(false);
  };

  // Handle Escape key to close feedback dialog
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showFeedbackDialog) {
        handleCloseFeedback();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showFeedbackDialog]);

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      {/* Top Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex gap-1">
          {['Stream', 'Webcam', 'Manage'].map((tab) => (
            <div key={tab} className="relative group">
              <button
                className="px-6 py-2 text-sm font-medium text-[#909090] bg-[#f9f9f9] rounded cursor-not-allowed"
                disabled
              >
                {tab}
              </button>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[#616161] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                You don't have access to this feature
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#616161]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenSettings}
            className="px-4 py-2 text-sm font-medium text-[#065fd4] border border-[#065fd4] rounded hover:bg-[#f0f7ff] transition-colors"
          >
            Channel Level Settings
          </button>
          <button
            onClick={handleOpenFeedback}
            className={`px-4 py-2 text-sm font-medium border rounded transition-colors ${
              showFeedbackDialog
                ? 'text-[#065fd4] border-[#065fd4] bg-[#f0f7ff]'
                : 'text-[#606060] border-[#d0d0d0] hover:bg-[#f9f9f9]'
            }`}
          >
            Send feedback
          </button>
        </div>
      </div>

      {/* Request Access Dialog */}
      <div className="bg-white border border-[#e5e5e5] rounded-md p-12 flex flex-col items-center justify-center min-h-[500px]">
        <div className="max-w-md text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#f0f7ff] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#065fd4]">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-medium text-[#0d0d0d] mb-4">
            Request access to streaming
          </h2>

          {/* Description */}
          <p className="text-sm text-[#606060] mb-8 leading-relaxed">
            Live streaming is available once you have access. After requesting access,
            you'll need to wait 24 hours before you can start your first live stream.
            This delay helps us protect the community.
          </p>

          {/* Request Button */}
          <button
            onClick={handleRequestAccess}
            className="bg-[#065fd4] text-white px-6 py-2.5 rounded hover:bg-[#0553c2] font-medium text-sm transition-colors"
          >
            Request
          </button>
        </div>
      </div>

      {/* Channel Level Settings Dialog */}
      {showSettingsDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseSettings}>
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#0d0d0d]">Settings</h2>
              <button
                onClick={handleCloseSettings}
                className="p-2 hover:bg-[#f9f9f9] rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="px-6 py-6">
              <div className="mb-6">
                <h3 className="text-base font-medium text-[#0d0d0d] mb-4">
                  Overlay for breaks
                </h3>
                <p className="text-sm text-[#606060] mb-4">
                  Choose what viewers see when you take a break during your stream
                </p>

                {/* Overlay Options */}
                <div className="space-y-3">
                  <button
                    onClick={() => setOverlaySelection('default')}
                    className={`w-full px-4 py-3 text-left border rounded transition-colors ${
                      overlaySelection === 'default'
                        ? 'border-[#065fd4] bg-[#f0f7ff]'
                        : 'border-[#d0d0d0] hover:bg-[#f9f9f9]'
                    }`}
                  >
                    <div className="font-medium text-sm text-[#0d0d0d]">Use default overlay</div>
                    <div className="text-xs text-[#606060] mt-1">
                      Show a default "Be Right Back" message
                    </div>
                  </button>

                  <button
                    onClick={() => setOverlaySelection('video')}
                    className={`w-full px-4 py-3 text-left border rounded transition-colors ${
                      overlaySelection === 'video'
                        ? 'border-[#065fd4] bg-[#f0f7ff]'
                        : 'border-[#d0d0d0] hover:bg-[#f9f9f9]'
                    }`}
                  >
                    <div className="font-medium text-sm text-[#0d0d0d]">Choose from your videos</div>
                    <div className="text-xs text-[#606060] mt-1">
                      Select a video from your channel to play during breaks
                    </div>
                  </button>
                </div>

                {/* Learn More Link */}
                <div className="mt-4">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNotImplemented('Learn more about overlays');
                    }}
                    className="text-sm text-[#065fd4] hover:underline"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-[#e5e5e5] flex items-center justify-end gap-3">
              <button
                onClick={handleCloseSettings}
                className="px-4 py-2 text-sm font-medium text-[#606060] hover:bg-[#f9f9f9] rounded transition-colors"
              >
                {overlaySelection ? 'Cancel' : 'Close'}
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={!overlaySelection}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  overlaySelection
                    ? 'bg-[#065fd4] text-white hover:bg-[#0553c2]'
                    : 'bg-[#f0f0f0] text-[#909090] cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Changes Confirmation Dialog */}
      {showDiscardConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Discard changes?</h3>
            <p className="text-sm text-[#606060] mb-6">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancelDiscard}
                className="px-4 py-2 text-sm font-medium text-[#606060] hover:bg-[#f9f9f9] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-4 py-2 text-sm font-medium bg-[#065fd4] text-white hover:bg-[#0553c2] rounded transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dialog */}
      {showFeedbackDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseFeedback}>
          <div
            className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#0d0d0d]">Send feedback</h2>
              <button
                onClick={handleCloseFeedback}
                className="p-2 hover:bg-[#f9f9f9] rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#606060]">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Feedback Iframe */}
            <div className="h-[600px] bg-[#f9f9f9] flex items-center justify-center">
              <div className="text-center p-8">
                <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#909090] mx-auto mb-4">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
                </svg>
                <p className="text-sm text-[#606060]">Feedback form would load here</p>
                <p className="text-xs text-[#909090] mt-2">Press ESC to close</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0d0d0d] text-white px-6 py-3 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
