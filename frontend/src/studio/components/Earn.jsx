import React, { useState } from 'react';

export default function Earn() {
  // State for expandable cards
  const [expandedNextMilestone, setExpandedNextMilestone] = useState('memberships');
  const [expandedFutureMilestone, setExpandedFutureMilestone] = useState(null);

  // State for notifications
  const [notified, setNotified] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // State for tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  // Mock channel metrics
  const channelMetrics = {
    subscribers: 0,
    videoUploads: 1,
    watchHours: 0,
    shortsViews: 0,
    dataDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  };

  // Next Milestone thresholds
  const nextMilestone = {
    subscribers: 500,
    videoUploads: 3,
    watchHours: 3000,
    shortsViews: 3000000
  };

  // Future Milestone thresholds
  const futureMilestone = {
    subscribers: 1000,
    watchHours: 4000,
    shortsViews: 10000000
  };

  const handleGetNotified = () => {
    setNotified(true);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const renderProgressBar = (current, threshold) => {
    const percentage = Math.min((current / threshold) * 100, 100);
    return (
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-[#0d0d0d] min-w-[60px]">{current.toLocaleString()}</span>
        <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#065fd4] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-[#606060] min-w-[80px] text-right">{threshold.toLocaleString()}</span>
      </div>
    );
  };

  const renderEarningCard = (id, title, tagline, description, isExpanded, onToggle) => {
    return (
      <div className="border border-[#e5e5e5] rounded-lg overflow-hidden mb-3">
        <button
          onClick={onToggle}
          className="w-full text-left p-4 hover:bg-[#f9f9f9] flex items-center justify-between transition-colors"
        >
          <div>
            <h4 className="text-[#0d0d0d] font-medium text-base">{title}</h4>
            <p className="text-[#606060] text-sm mt-1">{tagline}</p>
          </div>
          <svg
            viewBox="0 0 24 24"
            className={`w-6 h-6 fill-[#606060] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 pt-0 text-[#606060] text-sm leading-relaxed">
            {description}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal text-[#0d0d0d] mb-2">Earn on StreamView</h1>
        <p className="text-[#606060] text-base">
          Build your business with StreamView's monetization options
        </p>
      </div>

      {/* Saved Message */}
      {showSavedMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#0d0d0d] text-white px-6 py-3 rounded shadow-lg z-50">
          All changes saved
        </div>
      )}

      {/* Next Milestone Section */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#065fd4] text-white text-xs font-medium px-3 py-1 rounded-full">
            Next milestone
          </div>
          <h2 className="text-xl font-medium text-[#0d0d0d]">Start your earning journey</h2>
        </div>

        {/* Earning Methods */}
        <div className="mb-6">
          {renderEarningCard(
            'memberships',
            'Memberships',
            'Grow your community and earn monthly',
            'Offer channel memberships to your subscribers with perks like badges, emojis, and exclusive content. You earn 70% of the net revenue from memberships after StreamView\'s app store fees.',
            expandedNextMilestone === 'memberships',
            () => setExpandedNextMilestone(expandedNextMilestone === 'memberships' ? null : 'memberships')
          )}
          {renderEarningCard(
            'supers',
            'Supers',
            'Strengthen connections with your fans',
            'Let your fans show their support with Super Chat in live streams, Super Stickers in videos, and Super Thanks to show appreciation for your content. You earn 70% of the net revenue.',
            expandedNextMilestone === 'supers',
            () => setExpandedNextMilestone(expandedNextMilestone === 'supers' ? null : 'supers')
          )}
          {renderEarningCard(
            'shopping',
            'Shopping',
            'Connect your online store to StreamView',
            'Tag products from your store on videos and shorts. Your fans can browse and buy products without leaving StreamView. Drive sales and grow your business.',
            expandedNextMilestone === 'shopping',
            () => setExpandedNextMilestone(expandedNextMilestone === 'shopping' ? null : 'shopping')
          )}
        </div>

        {/* Eligibility Section */}
        <div className="border-t border-[#e5e5e5] pt-6">
          <h3 className="text-base font-medium text-[#0d0d0d] mb-4">Eligibility</h3>
          <p className="text-sm text-[#606060] mb-4">
            To join the StreamView Partner Program and earn from these features, you need to meet one of these milestones:
          </p>

          <div className="space-y-4 mb-6">
            {/* Subscribers */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#0d0d0d]">Subscribers</span>
              </div>
              {renderProgressBar(channelMetrics.subscribers, nextMilestone.subscribers)}
            </div>

            {/* Video Uploads */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#0d0d0d]">Video uploads (last 90 days)</span>
              </div>
              {renderProgressBar(channelMetrics.videoUploads, nextMilestone.videoUploads)}
            </div>

            {/* Watch Hours OR Shorts Views */}
            <div className="pl-4 border-l-2 border-[#e5e5e5]">
              <p className="text-sm text-[#606060] mb-3">Either:</p>

              {/* Watch Hours */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0d0d0d]">Valid public watch hours (last 12 months)</span>
                </div>
                {renderProgressBar(channelMetrics.watchHours, nextMilestone.watchHours)}
              </div>

              <p className="text-sm text-[#606060] mb-3 text-center">Or:</p>

              {/* Shorts Views */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0d0d0d]">Valid public Shorts views (last 90 days)</span>
                </div>
                {renderProgressBar(channelMetrics.shortsViews, nextMilestone.shortsViews)}
              </div>
            </div>
          </div>

          {/* Data Freshness */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-[#606060]">
              Showing data as of: {channelMetrics.dataDate}
            </span>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-[#606060] hover:text-[#0d0d0d]"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-[#0d0d0d] text-white text-xs p-3 rounded shadow-lg z-50">
                  <div className="font-medium mb-2">Why could this take a week to update?</div>
                  <p className="mb-2">
                    We need time to validate that views, watch time, and subscribers are legitimate and follow our policies.
                  </p>
                  <p>
                    Data shown here may differ from StreamView Analytics. Learn more about which metrics count toward monetization.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleGetNotified}
              disabled={notified}
              className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                notified
                  ? 'bg-[#f2f2f2] text-[#606060] cursor-not-allowed'
                  : 'bg-[#065fd4] text-white hover:bg-[#0553c2]'
              }`}
            >
              {notified ? "We'll let you know when you're eligible" : 'Get notified'}
            </button>
            <button
              disabled
              className="px-6 py-2 rounded text-sm font-medium bg-[#f2f2f2] text-[#aaa] cursor-not-allowed"
            >
              Apply now
            </button>
          </div>
        </div>
      </div>

      {/* Future Milestone Section */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#606060] text-white text-xs font-medium px-3 py-1 rounded-full">
            Future milestone
          </div>
          <h2 className="text-xl font-medium text-[#0d0d0d]">Continue to grow</h2>
        </div>

        {/* Earning Methods */}
        <div className="mb-6">
          {renderEarningCard(
            'watch-page-ads',
            'Watch Page Ads',
            'Earn from ads on your videos',
            'Earn money from ads shown before, during, or after your videos. You earn 55% of the net revenue from display, overlay, and video ads. The more engaging your content, the more you can earn.',
            expandedFutureMilestone === 'watch-page-ads',
            () => setExpandedFutureMilestone(expandedFutureMilestone === 'watch-page-ads' ? null : 'watch-page-ads')
          )}
          {renderEarningCard(
            'shorts-feed-ads',
            'Shorts Feed Ads',
            'Earn from ads on Shorts',
            'Earn from ads shown between Shorts in the Shorts Feed. Revenue is pooled based on your share of total Shorts views and music usage. The more views your Shorts get, the more you can earn.',
            expandedFutureMilestone === 'shorts-feed-ads',
            () => setExpandedFutureMilestone(expandedFutureMilestone === 'shorts-feed-ads' ? null : 'shorts-feed-ads')
          )}
        </div>

        {/* Eligibility Section */}
        <div className="border-t border-[#e5e5e5] pt-6">
          <h3 className="text-base font-medium text-[#0d0d0d] mb-4">Eligibility</h3>
          <p className="text-sm text-[#606060] mb-4">
            To unlock Watch Page Ads and Shorts Feed Ads, you need to meet these higher thresholds:
          </p>

          <div className="space-y-4 mb-6">
            {/* Subscribers */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#0d0d0d]">Subscribers</span>
              </div>
              {renderProgressBar(channelMetrics.subscribers, futureMilestone.subscribers)}
            </div>

            {/* Watch Hours OR Shorts Views */}
            <div className="pl-4 border-l-2 border-[#e5e5e5]">
              <p className="text-sm text-[#606060] mb-3">Either:</p>

              {/* Watch Hours */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0d0d0d]">Valid public watch hours (last 12 months)</span>
                </div>
                {renderProgressBar(channelMetrics.watchHours, futureMilestone.watchHours)}
              </div>

              <p className="text-sm text-[#606060] mb-3 text-center">Or:</p>

              {/* Shorts Views */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0d0d0d]">Valid public Shorts views (last 90 days)</span>
                </div>
                {renderProgressBar(channelMetrics.shortsViews, futureMilestone.shortsViews)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Resources & Tools */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 mb-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Creator resources & tools</h3>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://support.google.com/youtube/creators"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#065fd4] hover:underline text-sm"
          >
            StreamView Creator Support
          </a>
          <a
            href="https://studio.youtube.com/channel/copyright/match"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#065fd4] hover:underline text-sm"
          >
            Copyright Match Tool
          </a>
          <a
            href="https://support.google.com/youtube/answer/6388789"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#065fd4] hover:underline text-sm"
          >
            Video end screens
          </a>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 mb-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-4">Resources</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Support */}
          <div>
            <h4 className="text-sm font-medium text-[#0d0d0d] mb-3">Support</h4>
            <div className="space-y-2">
              <a
                href="https://support.google.com/youtube"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#065fd4] hover:underline text-sm"
              >
                Help Center
              </a>
              <a
                href="https://support.google.com/youtube/community"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#065fd4] hover:underline text-sm"
              >
                Community forums
              </a>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-medium text-[#0d0d0d] mb-3">Learn</h4>
            <div className="space-y-2">
              <a
                href="https://www.youtube.com/creators"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#065fd4] hover:underline text-sm"
              >
                StreamView Creators Channel
              </a>
            </div>
          </div>

          {/* Things to know */}
          <div>
            <h4 className="text-sm font-medium text-[#0d0d0d] mb-3">Things to know</h4>
            <div className="space-y-2">
              <a
                href="https://support.google.com/youtube/answer/1311392"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#065fd4] hover:underline text-sm"
              >
                Channel monetization policies
              </a>
              <a
                href="https://support.google.com/youtube/answer/6162278"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#065fd4] hover:underline text-sm"
              >
                Advertiser-friendly guidelines
              </a>
              <a
                href="https://support.google.com/youtube/answer/72857"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#065fd4] hover:underline text-sm"
              >
                Other ways to earn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* After You Apply Section */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
        <h3 className="text-lg font-medium text-[#0d0d0d] mb-3">After you apply</h3>
        <p className="text-sm text-[#606060] leading-relaxed mb-3">
          Once you apply, we'll review your channel to make sure it follows our{' '}
          <a
            href="https://support.google.com/youtube/answer/1311392"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#065fd4] hover:underline"
          >
            monetization policies
          </a>
          . This typically takes about a month, but can sometimes take longer. We'll email you with a decision once the review is complete.
        </p>
        <a
          href="https://support.google.com/youtube/answer/72857"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#065fd4] hover:underline text-sm font-medium"
        >
          Learn more
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
