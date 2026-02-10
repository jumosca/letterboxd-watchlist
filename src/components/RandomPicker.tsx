/**
 * RandomPicker Component
 *
 * Modal that picks a random film from the filtered list
 */

'use client';

import { useState } from 'react';
import { Film } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import StreamingBadges from './StreamingBadges';

interface RandomPickerProps {
  films: Film[];
  onClose: () => void;
}

export default function RandomPicker({ films, onClose }: RandomPickerProps) {
  const [pickedFilm, setPickedFilm] = useState<Film | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const pickRandom = () => {
    if (films.length === 0) return;

    setIsAnimating(true);

    // Animate for 1 second
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * films.length);
      setPickedFilm(films[randomIndex]);
      setIsAnimating(false);
    }, 1000);
  };

  // Auto-pick on mount if not already picked
  if (!pickedFilm && !isAnimating && films.length > 0) {
    pickRandom();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              🎲 Random Film Picker
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Picking from {films.length} film{films.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAnimating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Picking a film...
              </p>
            </div>
          ) : pickedFilm ? (
            <div className="space-y-6">
              {/* Film Card */}
              <div className="flex gap-6">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={getPosterUrl(pickedFilm.posterPath, 'w342')}
                    alt={`${pickedFilm.title} poster`}
                    className="w-48 rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-poster.png';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pickedFilm.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {pickedFilm.year}
                      {pickedFilm.runtime && ` • ${pickedFilm.runtime} min`}
                    </p>
                  </div>

                  {/* Rating */}
                  {pickedFilm.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <span className="text-xl font-bold text-gray-900">
                        {pickedFilm.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({pickedFilm.voteCount.toLocaleString()} votes)
                      </span>
                    </div>
                  )}

                  {/* Genres */}
                  {pickedFilm.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pickedFilm.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Overview */}
                  {pickedFilm.overview && (
                    <p className="text-gray-700 leading-relaxed">
                      {pickedFilm.overview}
                    </p>
                  )}

                  {/* Streaming */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Watch in Spain:
                    </h4>
                    <StreamingBadges streaming={pickedFilm.streaming} />
                  </div>

                  {/* Letterboxd Link */}
                  <a
                    href={pickedFilm.letterboxdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View on Letterboxd
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={pickRandom}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Pick Another
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No films to pick from!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
