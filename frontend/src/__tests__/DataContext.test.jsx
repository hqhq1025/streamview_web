import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataProvider, useData } from '../context/DataContext';

function Profile() {
  const { data } = useData();
  return <div>{data.user.displayName}</div>;
}

const response = (data) => new Response(JSON.stringify({ user_id: 'session-1', data }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});

afterEach(() => vi.unstubAllGlobals());

describe('profile after bootstrap completes', () => {
  it.each([
    { videos: [] },
    { videos: [], user: null },
    { videos: [], user: {} },
  ])('shows an unset profile for incomplete state %j', async (data) => {
    vi.stubGlobal('fetch', vi.fn(async () => response(data)));
    render(<DataProvider><Profile /></DataProvider>);

    expect(await screen.findByText('Profile not set')).toBeInTheDocument();
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  it('shows loading only while the bootstrap request is pending', async () => {
    let finish;
    vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => { finish = resolve; })));
    render(<DataProvider><Profile /></DataProvider>);
    expect(screen.getByText('Loading your feed...')).toBeInTheDocument();
    expect(screen.queryByText('Profile not set')).not.toBeInTheDocument();

    await act(async () => finish(response({ videos: [] })));

    expect(screen.getByText('Profile not set')).toBeInTheDocument();
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  it('keeps a profile supplied by the server', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => response({ user: { displayName: 'Existing account' } })));
    render(<DataProvider><Profile /></DataProvider>);
    expect(await screen.findByText('Existing account')).toBeInTheDocument();
    expect(screen.queryByText('Profile not set')).not.toBeInTheDocument();
  });

  it('shows a bootstrap error instead of claiming the profile is empty', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ detail: 'Service unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })));
    render(<DataProvider><Profile /></DataProvider>);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load your feed: Service unavailable');
    expect(screen.queryByText('Profile not set')).not.toBeInTheDocument();
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
});
