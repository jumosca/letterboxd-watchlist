/**
 * Core type definitions for the Letterboxd Watchlist application
 */

export interface Film {
  // Letterboxd data
  letterboxdUrl: string;
  addedDate: string;

  // TMDB data
  tmdbId: number;
  title: string;
  originalTitle: string;
  year: number;
  runtime: number | null; // minutes
  genres: string[];
  rating: number; // 0-10
  voteCount: number;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  originalLanguage: string;
  spokenLanguages: string[];

  // Streaming availability
  streaming: StreamingData | null;

  // Metadata
  lastEnriched: number; // timestamp
}

export interface StreamingData {
  link: string;
  providers: {
    flatrate?: StreamingProvider[];
    rent?: StreamingProvider[];
    buy?: StreamingProvider[];
  };
}

export interface StreamingProvider {
  providerId: number;
  providerName: string;
  logoPath: string;
}

export interface FilterState {
  length: 'any' | 'short' | 'medium' | 'long' | 'verylong';
  languages: string[];
  decades: number[];
  genres: string[];
  onlyStreaming: boolean;
  sortBy: 'added' | 'title' | 'runtime' | 'year';
  sortOrder: 'asc' | 'desc';
}

export interface BasicFilm {
  title: string;
  year: number;
  letterboxdUrl: string;
  addedDate: string;
  description: string;
}

export interface WatchlistCache {
  films: Film[];
  timestamp: number;
}
