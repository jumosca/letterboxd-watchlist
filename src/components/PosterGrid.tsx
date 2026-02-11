'use client';

import { Film } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';

interface PosterGridProps {
  films: Film[];
  onSelect: (id: number) => void;
  loading: boolean;
  syncing: boolean;
}

export default function PosterGrid({ films, onSelect, loading, syncing }: PosterGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xs uppercase tracking-widest text-gray-400">Loading watchlist…</p>
      </div>
    );
  }

  if (syncing) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xs uppercase tracking-widest text-gray-400">Syncing…</p>
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400">No films</p>
          <p className="text-xs text-gray-400 mt-2">Upload a CSV or sync your watchlist to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      {films.map((film) => (
        <button
          key={film.tmdbId}
          onClick={() => onSelect(film.tmdbId)}
          className="text-left group"
        >
          <div className="aspect-[2/3] overflow-hidden bg-gray-100">
            <img
              src={getPosterUrl(film.posterPath)}
              alt={`${film.title} poster`}
              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-poster.png';
              }}
            />
          </div>
          <div className="mt-1.5">
            <p className="text-xs font-medium leading-tight line-clamp-2 uppercase tracking-tight">
              {film.title}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">
              {film.year}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
