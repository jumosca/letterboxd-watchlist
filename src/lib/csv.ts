/**
 * Client-side CSV parser for Letterboxd watchlist exports
 */

import { BasicFilm } from './types';

const REQUIRED_HEADERS = ['Date', 'Name', 'Year', 'Letterboxd URI'];

/**
 * Parse a Letterboxd CSV export into an array of BasicFilm objects.
 * Throws if required headers are missing.
 */
export function parseCsvToFilms(csvText: string): BasicFilm[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].replace(/\r/g, '').split(',');

  // Validate required headers
  for (const required of REQUIRED_HEADERS) {
    if (!headers.includes(required)) {
      throw new Error(`Missing required CSV column: "${required}"`);
    }
  }

  const dateIdx = headers.indexOf('Date');
  const nameIdx = headers.indexOf('Name');
  const yearIdx = headers.indexOf('Year');
  const uriIdx = headers.indexOf('Letterboxd URI');

  const clean = (s: string) => s?.replace(/^"|"$/g, '').trim() ?? '';

  return lines
    .slice(1)
    .map((line) => {
      const cols = line.replace(/\r/g, '').split(',');
      return {
        title: clean(cols[nameIdx]),
        year: parseInt(clean(cols[yearIdx])) || 0,
        letterboxdUrl: clean(cols[uriIdx]),
        addedDate: clean(cols[dateIdx]),
        description: '',
      };
    })
    .filter((f) => f.title);
}
