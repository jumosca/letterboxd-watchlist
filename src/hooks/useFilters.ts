'use client';

import { useState, useMemo, useCallback } from 'react';
import { Film, FilterState } from '@/lib/types';

const DEFAULT_FILTERS: FilterState = {
  length: 'any',
  languages: [],
  decades: [],
  genres: [],
  onlyStreaming: false,
  sortBy: 'added',
  sortOrder: 'desc',
};

export function useFilters(films: Film[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filterOptions = useMemo(() => {
    const allDecades = [];
    for (let decade = 1920; decade <= 2020; decade += 10) {
      allDecades.push(decade);
    }

    const allGenres = [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
      'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
      'Thriller', 'TV Movie', 'War', 'Western',
    ];

    const allLanguages = [
      'Arabic', 'Bengali', 'Cantonese', 'Chinese', 'Czech', 'Danish',
      'Dutch', 'English', 'Finnish', 'French', 'German', 'Greek',
      'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian', 'Japanese',
      'Korean', 'Malay', 'Mandarin', 'Norwegian', 'Persian', 'Polish',
      'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Spanish', 'Swedish',
      'Tagalog', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian',
      'Urdu', 'Vietnamese',
    ];

    return {
      languages: allLanguages,
      decades: allDecades.reverse(),
      genres: allGenres,
    };
  }, []);

  const filteredFilms = useMemo(() => {
    let result = [...films];

    if (filters.length !== 'any') {
      result = result.filter((film) => {
        if (!film.runtime) return false;
        switch (filters.length) {
          case 'short':    return film.runtime < 90;
          case 'medium':   return film.runtime >= 90 && film.runtime <= 120;
          case 'long':     return film.runtime > 120 && film.runtime <= 150;
          case 'verylong': return film.runtime > 150;
          default:         return true;
        }
      });
    }

    if (filters.languages.length > 0) {
      result = result.filter((film) =>
        film.spokenLanguages.some((lang) => filters.languages.includes(lang))
      );
    }

    if (filters.decades.length > 0) {
      result = result.filter((film) => {
        const decade = Math.floor(film.year / 10) * 10;
        return filters.decades.includes(decade);
      });
    }

    if (filters.genres.length > 0) {
      result = result.filter((film) =>
        film.genres.some((genre) => filters.genres.includes(genre))
      );
    }

    if (filters.onlyStreaming) {
      result = result.filter((film) => {
        if (!film.streaming) return false;
        const providers = film.streaming.providers;
        return (
          (providers.flatrate && providers.flatrate.length > 0) ||
          (providers.rent && providers.rent.length > 0) ||
          (providers.buy && providers.buy.length > 0)
        );
      });
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'added':
          comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'runtime':
          comparison = (a.runtime || 0) - (b.runtime || 0);
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [films, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.length !== 'any') count++;
    if (filters.languages.length > 0) count++;
    if (filters.decades.length > 0) count++;
    if (filters.genres.length > 0) count++;
    if (filters.onlyStreaming) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
    filteredFilms,
    activeFilterCount,
  };
}
