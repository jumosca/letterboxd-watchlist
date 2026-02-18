/**
 * Client-side API utilities
 *
 * Functions to call our Next.js API routes from the client
 */

import { BasicFilm, Film } from './types';
import { parseCsvToFilms } from './csv';

/**
 * Upload a Letterboxd CSV file and sync with the cached film list.
 * Only new films (not already in cache) are sent to /api/enrich.
 * Films removed from the CSV are dropped from the result.
 */
export async function uploadAndSync(
  file: File,
  cachedFilms: Film[]
): Promise<Film[]> {
  // Client-side file validation
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File is too large. Maximum size is 2MB.');
  }
  if (!file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('Invalid file type. Please upload a .csv file.');
  }

  // Read file text
  const csvText = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });

  // Parse CSV
  const basicFilms = parseCsvToFilms(csvText);

  if (basicFilms.length > 5000) {
    throw new Error('CSV contains too many rows. Maximum is 5000.');
  }

  // Build sets for the diff
  const newCsvUrls = new Set(basicFilms.map((f) => f.letterboxdUrl));
  const cachedUrlSet = new Set(cachedFilms.map((f) => f.letterboxdUrl));

  // Films in new CSV not already cached → need enrichment
  const newFilms = basicFilms.filter((f) => !cachedUrlSet.has(f.letterboxdUrl));

  // Cached films still present in the new CSV → keep as-is
  const keptFilms = cachedFilms.filter((f) => newCsvUrls.has(f.letterboxdUrl));

  // Enrich only the new films
  let enrichedNew: Film[] = [];
  if (newFilms.length > 0) {
    const response = await fetch('/api/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ films: newFilms }),
    });

    if (!response.ok) {
      throw new Error('Failed to enrich new films with TMDB data');
    }

    const data = await response.json();
    enrichedNew = data.films;
  }

  return [...keptFilms, ...enrichedNew];
}

/**
 * Enrich a list of basic films with TMDB data
 */
export async function enrichFilms(basicFilms: BasicFilm[]): Promise<Film[]> {
  try {
    const response = await fetch('/api/enrich', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ films: basicFilms }),
    });

    if (!response.ok) {
      throw new Error('Failed to enrich films');
    }

    const data = await response.json();
    return data.films;
  } catch (error) {
    console.error('Error enriching films:', error);
    throw error;
  }
}
