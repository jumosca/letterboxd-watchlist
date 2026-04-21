'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWatchedIds, addWatchedId } from '@/lib/storage';

export function useWatched() {
  const [watchedIds, setWatchedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setWatchedIds(new Set(getWatchedIds()));
  }, []);

  const markWatched = useCallback((tmdbId: number) => {
    addWatchedId(tmdbId);
    setWatchedIds((prev) => new Set([...prev, tmdbId]));
  }, []);

  return { watchedIds, markWatched };
}
