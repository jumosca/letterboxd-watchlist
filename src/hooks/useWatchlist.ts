/**
 * useWatchlist Hook
 *
 * Manages watchlist data, sync operations, and caching
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Film } from '@/lib/types';
import {
  getStoredWatchlist,
  storeWatchlist,
  isCacheValid,
  getLastSyncString,
} from '@/lib/storage';
import { uploadAndSync as apiUploadAndSync } from '@/lib/api';

export function useWatchlist() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from cache on mount
  useEffect(() => {
    const cached = getStoredWatchlist();
    if (cached) {
      setFilms(cached.films);
      setLastSync(cached.timestamp);
    }
    setLoading(false);
  }, []);

  /**
   * Upload a Letterboxd CSV export and incrementally sync the watchlist
   */
  const uploadAndSync = useCallback(async (file: File) => {
    setSyncing(true);
    setError(null);

    try {
      const result = await apiUploadAndSync(file, films);
      const timestamp = Date.now();
      storeWatchlist(result, timestamp);
      setFilms(result);
      setLastSync(timestamp);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload CSV';
      setError(errorMessage);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [films]);

  /**
   * Check if cache is stale and needs refresh
   */
  const isCacheStale = useCallback(() => {
    return !isCacheValid();
  }, []);

  /**
   * Get human-readable last sync time
   */
  const getLastSyncTime = useCallback(() => {
    return getLastSyncString();
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    films,
    loading,
    syncing,
    lastSync,
    error,
    uploadAndSync,
    isCacheStale,
    getLastSyncTime,
    clearError,
  };
}
