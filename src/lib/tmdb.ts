/**
 * TMDB API Client
 *
 * Provides functions to interact with The Movie Database (TMDB) API
 * for movie metadata and streaming availability information.
 */

import axios, { AxiosInstance } from 'axios';
import { appConfig } from '@/config/app.config';
import { StreamingData, StreamingProvider } from './types';

// Create axios instance with TMDB configuration
const tmdbClient: AxiosInstance = axios.create({
  baseURL: appConfig.tmdb.baseUrl,
  params: {
    api_key: appConfig.tmdb.apiKey,
  },
});

/**
 * Search for a movie by title and optional year
 * Returns the best match (first result)
 */
export async function searchMovie(
  title: string,
  year?: number
): Promise<any | null> {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: {
        query: title,
        year,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }

    return null;
  } catch (error) {
    console.error(`Error searching for movie "${title}":`, error);
    return null;
  }
}

/**
 * Get detailed movie information by TMDB ID
 * Optionally append additional data like watch providers
 */
export async function getMovieDetails(
  movieId: number,
  appendToResponse?: string[]
): Promise<any | null> {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: appendToResponse?.join(','),
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    return null;
  }
}

/**
 * Get streaming providers (watch providers) for a specific movie
 * Filtered by the configured country code (Spain: ES)
 */
export async function getWatchProviders(
  movieId: number
): Promise<StreamingData | null> {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/watch/providers`);
    const countryData = response.data.results[appConfig.tmdb.countryCode];

    if (!countryData) {
      return null;
    }

    // Transform TMDB provider format to our StreamingProvider interface
    const transformProviders = (
      providers: any[] | undefined
    ): StreamingProvider[] | undefined => {
      if (!providers || providers.length === 0) return undefined;

      return providers.map((p) => ({
        providerId: p.provider_id,
        providerName: p.provider_name,
        logoPath: p.logo_path,
      }));
    };

    return {
      link: countryData.link || '',
      providers: {
        flatrate: transformProviders(countryData.flatrate),
        rent: transformProviders(countryData.rent),
        buy: transformProviders(countryData.buy),
      },
    };
  } catch (error) {
    console.error(
      `Error fetching watch providers for movie ID ${movieId}:`,
      error
    );
    return null;
  }
}

/**
 * Get the full URL for a poster image
 * Returns placeholder if path is null
 */
export function getPosterUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'
): string {
  if (!path) return '/placeholder-poster.png';
  return `${appConfig.tmdb.imageBaseUrl}/${size}${path}`;
}

/**
 * Get the full URL for a backdrop image
 * Returns placeholder if path is null
 */
export function getBackdropUrl(
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280'
): string {
  if (!path) return '/placeholder-backdrop.png';
  return `${appConfig.tmdb.imageBaseUrl}/${size}${path}`;
}

/**
 * Get the full URL for a provider logo
 */
export function getProviderLogoUrl(
  path: string,
  size: 'w45' | 'w92' | 'w154' | 'w185' | 'original' = 'w92'
): string {
  return `${appConfig.tmdb.imageBaseUrl}/${size}${path}`;
}

/**
 * Search and get complete movie data including streaming providers
 * This is a convenience function that combines search + details + providers
 */
export async function searchAndEnrichMovie(
  title: string,
  year?: number
): Promise<any | null> {
  try {
    // Step 1: Search for the movie
    const searchResult = await searchMovie(title, year);
    if (!searchResult) return null;

    const movieId = searchResult.id;

    // Step 2: Get detailed information with streaming providers
    const details = await getMovieDetails(movieId, ['watch/providers']);
    if (!details) return null;

    // Step 3: Extract streaming data
    const streaming = await getWatchProviders(movieId);

    return {
      ...details,
      streaming,
    };
  } catch (error) {
    console.error(`Error enriching movie "${title}":`, error);
    return null;
  }
}

/**
 * Batch search and enrich multiple movies with rate limiting
 * Processes movies in chunks to respect API rate limits
 */
export async function batchEnrichMovies(
  movies: Array<{ title: string; year?: number }>,
  chunkSize: number = 20
): Promise<any[]> {
  const results: any[] = [];

  // Process in chunks
  for (let i = 0; i < movies.length; i += chunkSize) {
    const chunk = movies.slice(i, i + chunkSize);

    // Process chunk in parallel
    const chunkResults = await Promise.all(
      chunk.map((movie) => searchAndEnrichMovie(movie.title, movie.year))
    );

    results.push(...chunkResults);

    // Add delay between chunks to respect rate limits (optional, TMDB allows 40 req/sec)
    if (i + chunkSize < movies.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}
