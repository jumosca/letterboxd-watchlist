/**
 * localStorage Utilities
 *
 * Manages caching of watchlist data in browser localStorage
 */

import { Film, WatchlistCache } from './types';
import { appConfig } from '@/config/app.config';

const STORAGE_KEY = 'letterboxd_watchlist';
const WATCHED_KEY = 'letterboxd_watched';

/**
 * Check if we're in the browser (not SSR)
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Store watchlist data in localStorage with timestamp
 */
export function storeWatchlist(films: Film[], timestamp: number): void {
  if (!isBrowser) return;

  try {
    const cache: WatchlistCache = {
      films,
      timestamp,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to store watchlist in localStorage:', error);
    // Handle quota exceeded errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn(
        'localStorage quota exceeded. Consider clearing old data or reducing cache size.'
      );
    }
  }
}

/**
 * Retrieve watchlist data from localStorage
 * Returns null if no data exists or if cache is expired
 */
export function getStoredWatchlist(): WatchlistCache | null {
  if (!isBrowser) return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const cache: WatchlistCache = JSON.parse(stored);

    // Validate cache structure
    if (!cache.films || !cache.timestamp) {
      console.warn('Invalid cache structure, clearing storage');
      clearWatchlist();
      return null;
    }

    return cache;
  } catch (error) {
    console.error('Failed to retrieve watchlist from localStorage:', error);
    // Clear corrupted data
    clearWatchlist();
    return null;
  }
}

/**
 * Check if cached data is still valid based on TTL
 */
export function isCacheValid(): boolean {
  const cache = getStoredWatchlist();
  if (!cache) return false;

  const now = Date.now();
  const age = now - cache.timestamp;

  return age < appConfig.cache.ttl;
}

/**
 * Clear watchlist data from localStorage
 */
export function clearWatchlist(): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear watchlist from localStorage:', error);
  }
}

/**
 * Get the age of cached data in milliseconds
 * Returns null if no cache exists
 */
export function getCacheAge(): number | null {
  const cache = getStoredWatchlist();
  if (!cache) return null;

  return Date.now() - cache.timestamp;
}

/**
 * Get a human-readable string for when data was last synced
 * e.g., "2 hours ago", "1 day ago"
 */
export function getLastSyncString(): string | null {
  const cache = getStoredWatchlist();
  if (!cache) return null;

  const age = getCacheAge();
  if (age === null) return null;

  const seconds = Math.floor(age / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function getWatchedIds(): number[] {
  if (!isBrowser) return [];
  try {
    const stored = localStorage.getItem(WATCHED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addWatchedId(tmdbId: number): void {
  if (!isBrowser) return;
  try {
    const ids = getWatchedIds();
    if (!ids.includes(tmdbId)) {
      localStorage.setItem(WATCHED_KEY, JSON.stringify([...ids, tmdbId]));
    }
  } catch (error) {
    console.error('Failed to save watched id:', error);
  }
}

/**
 * Get storage usage information
 * Useful for debugging and monitoring
 */
export function getStorageInfo(): {
  exists: boolean;
  filmCount: number;
  sizeKB: number;
  lastSync: string | null;
} {
  const cache = getStoredWatchlist();

  if (!cache) {
    return {
      exists: false,
      filmCount: 0,
      sizeKB: 0,
      lastSync: null,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY) || '';
  const sizeBytes = new Blob([stored]).size;
  const sizeKB = Math.round(sizeBytes / 1024);

  return {
    exists: true,
    filmCount: cache.films.length,
    sizeKB,
    lastSync: getLastSyncString(),
  };
}
