/**
 * WatchlistGrid Component
 *
 * Responsive grid layout for displaying film cards
 */

'use client';

import { Film } from '@/lib/types';
import FilmCard from './FilmCard';

interface WatchlistGridProps {
  films: Film[];
  loading: boolean;
  syncing: boolean;
}

export default function WatchlistGrid({
  films,
  loading,
  syncing,
}: WatchlistGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (films.length === 0 && !syncing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No films in your watchlist
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Click the &quot;Sync Watchlist&quot; button above to load your Letterboxd
            watchlist.
          </p>
        </div>
      </div>
    );
  }

  // Syncing overlay
  if (syncing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Syncing your watchlist...</p>
          <p className="mt-2 text-sm text-gray-500">
            This may take a moment while we fetch data from TMDB
          </p>
        </div>
      </div>
    );
  }

  // Grid of films
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {films.map((film) => (
        <FilmCard key={film.tmdbId} film={film} />
      ))}
    </div>
  );
}
