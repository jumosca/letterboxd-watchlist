'use client';

import { Film } from '@/lib/types';

interface FilmListProps {
  films: Film[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function FilmList({ films, selectedId, onSelect }: FilmListProps) {
  if (films.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm uppercase tracking-widest">
        No films
      </div>
    );
  }

  return (
    <ul>
      {films.map((film, index) => {
        const isSelected = film.tmdbId === selectedId;
        const num = String(index + 1).padStart(2, '0');

        return (
          <li key={film.tmdbId}>
            <button
              onClick={() => onSelect(film.tmdbId)}
              className={`w-full text-left flex items-baseline gap-3 px-4 py-1.5 border-b border-black/6 transition-colors ${
                isSelected
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-50 text-black'
              }`}
            >
              <span
                className={`font-mono text-xs shrink-0 ${
                  isSelected ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {num}
              </span>
              <span className="flex-1 min-w-0 flex items-baseline justify-between gap-2 overflow-hidden">
                <span className="flex items-baseline gap-2 truncate min-w-0">
                  <span className="text-sm font-medium leading-tight truncate">
                    {film.title.toUpperCase()}
                  </span>
                  <span className={`text-xs uppercase tracking-widest shrink-0 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {film.year}
                  </span>
                </span>
                {film.runtime && (
                  <span className={`text-xs uppercase tracking-widest shrink-0 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {film.runtime}min
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
