import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

const buildResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('App', () => {
  const statePayload = {
    user_id: 'test-user',
    state: {
      meta: { created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', version: 1 },
      data: {
        user: {
          userId: 'user-1',
          displayName: 'Test User',
          email: 'test@example.com',
          handle: '@test',
          avatar: 'https://picsum.photos/100/100?random=test',
          subscribedChannels: [],
          watchHistory: [],
          likedVideos: [],
          watchLater: [],
          playlists: [],
        },
        videos: [
          {
            videoId: 'video-1',
            title: 'Test Video',
            description: 'Test description',
            channelId: 'channel-1',
            channelName: 'Channel One',
            channelAvatar: 'https://picsum.photos/32/32?random=channel',
            thumbnail: 'https://picsum.photos/640/360?random=video',
            duration: '1:00',
            uploadDate: '2024-01-01T00:00:00Z',
            viewCount: 10,
            likeCount: 1,
            category: 'Tech',
            videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE?rel=0',
            watchUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
          },
        ],
        channels: [
          {
            channelId: 'channel-1',
            name: 'Channel One',
            handle: '@channelone',
            avatar: 'https://picsum.photos/100/100?random=channel',
            banner: 'https://picsum.photos/1600/400?random=banner',
            description: 'Channel description',
            subscriberCount: 10,
            videoCount: 1,
            joinedDate: '2020-01-01',
            links: [],
            videos: [],
          },
        ],
        comments: {},
        playlists: [],
        notifications: [],
        categories: ['All', 'Tech'],
      },
      note: null,
    },
  };

  beforeEach(() => {
    global.fetch = vi.fn(async () => buildResponse(statePayload));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the StreamView header and home feed', async () => {
    render(<App />);

    expect(await screen.findByText(/StreamView/i)).toBeInTheDocument();
    expect(await screen.findByText(/Test Video/i)).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });
});
