/**
 * useFilters Hook
 *
 * Manages filter and sort state for the watchlist
 * Provides filtering and sorting logic
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Film, FilterState } from '@/lib/types';

const DEFAULT_FILTERS: FilterState = {
  length: 'any',
  languages: [],
  decades: [],
  ratingMin: 0,
  ratingMax: 10,
  genres: [],
  onlyStreaming: false,
  sortBy: 'added',
  sortOrder: 'desc',
};

export function useFilters(films: Film[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  /**
   * Update a specific filter
   */
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /**
   * Get unique values for filter dropdowns
   */
  const filterOptions = useMemo(() => {
    // Generate all decades from 1920s to 2020s
    const allDecades = [];
    for (let decade = 1920; decade <= 2020; decade += 10) {
      allDecades.push(decade);
    }

    // All standard film genres (Letterboxd/TMDB)
    const allGenres = [
      'Action',
      'Adventure',
      'Animation',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'History',
      'Horror',
      'Music',
      'Mystery',
      'Romance',
      'Science Fiction',
      'Thriller',
      'TV Movie',
      'War',
      'Western',
    ];

    // Major film languages from around the world
    const allLanguages = [
      'Arabic',
      'Bengali',
      'Cantonese',
      'Chinese',
      'Czech',
      'Danish',
      'Dutch',
      'English',
      'Finnish',
      'French',
      'German',
      'Greek',
      'Hebrew',
      'Hindi',
      'Hungarian',
      'Indonesian',
      'Italian',
      'Japanese',
      'Korean',
      'Malay',
      'Mandarin',
      'Norwegian',
      'Persian',
      'Polish',
      'Portuguese',
      'Punjabi',
      'Romanian',
      'Russian',
      'Spanish',
      'Swedish',
      'Tagalog',
      'Tamil',
      'Telugu',
      'Thai',
      'Turkish',
      'Ukrainian',
      'Urdu',
      'Vietnamese',
    ];

    return {
      languages: allLanguages, // Already alphabetically sorted
      decades: allDecades.reverse(), // Newest first
      genres: allGenres, // Already alphabetically sorted
    };
  }, [films]);

  /**
   * Apply filters and sorting to films
   */
  const filteredFilms = useMemo(() => {
    let result = [...films];

    // Filter by length
    if (filters.length !== 'any') {
      result = result.filter((film) => {
        if (!film.runtime) return false;

        switch (filters.length) {
          case 'short':
            return film.runtime < 90;
          case 'medium':
            return film.runtime >= 90 && film.runtime <= 120;
          case 'long':
            return film.runtime > 120 && film.runtime <= 150;
          case 'verylong':
            return film.runtime > 150;
          default:
            return true;
        }
      });
    }

    // Filter by languages
    if (filters.languages.length > 0) {
      result = result.filter((film) =>
        film.spokenLanguages.some((lang) => filters.languages.includes(lang))
      );
    }

    // Filter by decades
    if (filters.decades.length > 0) {
      result = result.filter((film) => {
        const decade = Math.floor(film.year / 10) * 10;
        return filters.decades.includes(decade);
      });
    }

    // Filter by rating range
    result = result.filter(
      (film) =>
        film.rating >= filters.ratingMin && film.rating <= filters.ratingMax
    );

    // Filter by genres
    if (filters.genres.length > 0) {
      result = result.filter((film) =>
        film.genres.some((genre) => filters.genres.includes(genre))
      );
    }

    // Filter by streaming availability
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

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'added':
          comparison =
            new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
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

  /**
   * Get count of active filters
   */
  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.length !== 'any') count++;
    if (filters.languages.length > 0) count++;
    if (filters.decades.length > 0) count++;
    if (filters.ratingMin !== 0 || filters.ratingMax !== 10) count++;
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
