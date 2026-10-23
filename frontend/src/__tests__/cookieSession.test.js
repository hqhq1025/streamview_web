import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyCookieFromQuery } from '../cookieSession';

describe('cookie session entry URLs', () => {
  let location;
  let writes;

  beforeEach(() => {
    writes = [];
    location = { href: '', replace: vi.fn(() => {
      expect(writes).toHaveLength(1);
    }) };
    vi.stubGlobal('window', { location });
    vi.stubGlobal('document', { set cookie(value) { writes.push(value); } });
  });

  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['/watch/video-1?cookie=session-1', '/watch/video-1'],
    ['/channel/channel-1?cookie=session-1', '/channel/channel-1'],
    ['/studio/editing/video-1?upload=1&cookie=session-1#details', '/studio/editing/video-1?upload=1#details'],
    ['/search?q=curve+fit&cookie=session-1&tag=a&tag=b#results', '/search?q=curve+fit&tag=a&tag=b#results'],
    ['/?cookie=session-1', '/'],
    ['/watch/video-1?cookie=session-1&cookie=other&t=20', '/watch/video-1?t=20'],
  ])('preserves the requested page for %s', (input, expected) => {
    location.href = `https://streamview.example${input}`;

    expect(applyCookieFromQuery()).toBe(true);

    expect(location.replace).toHaveBeenCalledExactlyOnceWith(`https://streamview.example${expected}`);
    expect(writes[0]).toBe('user_id=session-1; Path=/; SameSite=Lax; Max-Age=2592000');
    location.href = location.replace.mock.calls[0][0];
    expect(applyCookieFromQuery()).toBe(false);
    expect(location.replace).toHaveBeenCalledTimes(1);
    expect(writes).toHaveLength(1);
  });

  it.each(['/watch/video-1?t=20#chapter', '/watch/video-1?cookie=&t=20'])('leaves %s unchanged without a session value', (path) => {
    location.href = `https://streamview.example${path}`;
    expect(applyCookieFromQuery()).toBe(false);
    expect(location.replace).not.toHaveBeenCalled();
    expect(writes).toHaveLength(0);
  });

  it('encodes the session value before writing the cookie', () => {
    location.href = 'https://streamview.example/watch/video-1?cookie=a%3Bb%20c';
    expect(applyCookieFromQuery()).toBe(true);
    expect(writes[0]).toContain('user_id=a%3Bb%20c;');
  });

  it('does nothing without a browser window', () => {
    vi.stubGlobal('window', undefined);
    expect(applyCookieFromQuery()).toBe(false);
    expect(writes).toHaveLength(0);
  });
});
