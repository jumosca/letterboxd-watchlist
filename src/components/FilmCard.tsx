/**
 * FilmCard Component
 *
 * Displays an individual film with poster, metadata, and streaming info
 */

'use client';

import { Film } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import StreamingBadges from './StreamingBadges';

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  const posterUrl = getPosterUrl(film.posterPath);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Poster */}
      <a
        href={film.letterboxdUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-[2/3] bg-gray-200"
      >
        <img
          src={posterUrl}
          alt={`${film.title} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-poster.png';
          }}
        />
        {/* Rating badge */}
        {film.rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm font-bold">
            ⭐ {film.rating.toFixed(1)}
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Year */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
            {film.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {film.year}
            {film.runtime && ` • ${film.runtime}min`}
          </p>
        </div>

        {/* Genres */}
        {film.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {film.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Overview (optional, hidden by default) */}
        {film.overview && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {film.overview}
          </p>
        )}

        {/* Streaming Availability */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Available in Spain:
          </p>
          <StreamingBadges streaming={film.streaming} compact />
        </div>
      </div>
    </div>
  );
}
