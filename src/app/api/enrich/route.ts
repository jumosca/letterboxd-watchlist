/**
 * Film Enrichment API Route
 *
 * Receives basic film data and enriches it with TMDB metadata
 * and streaming availability information
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchAndEnrichMovie } from '@/lib/tmdb';
import { Film, BasicFilm } from '@/lib/types';

// In-memory rate limiter: 3 requests per IP per 60 seconds
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimit.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimit.set(ip, timestamps);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in a minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { films } = body as { films: BasicFilm[] };

    if (!films || !Array.isArray(films)) {
      return NextResponse.json(
        { error: 'Invalid request: films array required' },
        { status: 400 }
      );
    }

    // Server-side validation and sanitization
    if (films.length > 500) {
      return NextResponse.json(
        { error: 'Too many films: max 500 per request' },
        { status: 400 }
      );
    }

    const urlPattern = /^https:\/\/(boxd\.it|letterboxd\.com)\//;

    const sanitizedFilms: BasicFilm[] = films.map((film) => {
      // Strip HTML tags from title
      const sanitizedTitle = String(film.title ?? '')
        .replace(/[<>]/g, '')
        .slice(0, 300);

      // Validate year range
      const year = Number(film.year);
      const safeYear = Number.isFinite(year) && year >= 1880 && year <= 2030 ? year : 0;

      // Validate letterboxdUrl
      const url = String(film.letterboxdUrl ?? '');
      const safeUrl = url === '' || urlPattern.test(url) ? url : '';

      return {
        ...film,
        title: sanitizedTitle,
        year: safeYear,
        letterboxdUrl: safeUrl,
      };
    });

    // Enrich each film with TMDB data
    const enrichedFilms: Film[] = [];

    for (const basicFilm of sanitizedFilms) {
      try {
        // Search TMDB and get enriched data
        const tmdbData = await searchAndEnrichMovie(
          basicFilm.title,
          basicFilm.year
        );

        if (!tmdbData) {
          console.warn(
            `Could not find TMDB data for "${basicFilm.title}" (${basicFilm.year})`
          );
          continue;
        }

        // Transform TMDB data to our Film interface
        const enrichedFilm: Film = {
          // Letterboxd data
          letterboxdUrl: basicFilm.letterboxdUrl,
          addedDate: basicFilm.addedDate,

          // TMDB data
          tmdbId: tmdbData.id,
          title: tmdbData.title,
          originalTitle: tmdbData.original_title,
          year: tmdbData.release_date
            ? new Date(tmdbData.release_date).getFullYear()
            : basicFilm.year,
          runtime: tmdbData.runtime || null,
          genres: tmdbData.genres
            ? tmdbData.genres.map((g: any) => g.name)
            : [],
          rating: tmdbData.vote_average || 0,
          voteCount: tmdbData.vote_count || 0,
          overview: tmdbData.overview || '',
          posterPath: tmdbData.poster_path,
          backdropPath: tmdbData.backdrop_path,
          originalLanguage: tmdbData.original_language || '',
          spokenLanguages: tmdbData.spoken_languages
            ? tmdbData.spoken_languages.map((l: any) => l.english_name)
            : [],

          // Streaming availability
          streaming: tmdbData.streaming || null,

          // Metadata
          lastEnriched: Date.now(),
        };

        enrichedFilms.push(enrichedFilm);

        // Small delay to be respectful to TMDB API
        // (TMDB allows 40 req/sec, but being conservative)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `Error enriching film "${basicFilm.title}":`,
          error
        );
        // Continue with next film even if one fails
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      enrichedCount: enrichedFilms.length,
      totalCount: sanitizedFilms.length,
      films: enrichedFilms,
    });
  } catch (error) {
    console.error('Error in enrich API route:', error);
    return NextResponse.json(
      { error: 'Failed to enrich films' },
      { status: 500 }
    );
  }
}
