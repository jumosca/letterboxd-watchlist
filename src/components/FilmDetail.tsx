'use client';

import { Film } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import StreamingBadges from './StreamingBadges';

interface FilmDetailProps {
  film: Film;
  onClose: () => void;
}

export default function FilmDetail({ film, onClose }: FilmDetailProps) {
  const posterUrl = getPosterUrl(film.posterPath, 'w342');

  return (
    <div className="p-6 h-full">
      {/* Close button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-widest border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
        >
          ×  Close
        </button>
      </div>

      <div className="flex gap-8">
        {/* Poster */}
        <div className="shrink-0 w-[40%] max-w-[260px]">
          <img
            src={posterUrl}
            alt={`${film.title} poster`}
            className="w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-poster.png';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold leading-tight uppercase tracking-tight">
              {film.title}
            </h2>
            {film.originalTitle && film.originalTitle !== film.title && (
              <p className="text-sm text-gray-500 mt-1 italic">{film.originalTitle}</p>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-widest text-gray-600">
            <span>{film.year}</span>
            {film.runtime && <span>{film.runtime} min</span>}
            {film.originalLanguage && (
              <span>{film.originalLanguage.toUpperCase()}</span>
            )}
          </div>

          {/* Genres */}
          {film.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {film.genres.map((genre) => (
                <span
                  key={genre}
                  className="text-xs uppercase tracking-widest border border-black px-2 py-1"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {film.overview && (
            <p className="text-sm leading-relaxed text-gray-700">
              {film.overview}
            </p>
          )}

          {/* Streaming */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium">
              Available in Spain
            </p>
            <StreamingBadges streaming={film.streaming} />
          </div>

          {/* Letterboxd link */}
          <a
            href={film.letterboxdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-widest border-b border-black hover:text-gray-600 transition-colors"
          >
            View on Letterboxd →
          </a>
        </div>
      </div>
    </div>
  );
}
