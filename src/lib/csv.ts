/**
 * Client-side CSV parser for Letterboxd watchlist exports
 */

import { BasicFilm } from './types';

const REQUIRED_HEADERS = ['Date', 'Name', 'Year', 'Letterboxd URI'];

/**
 * Parse a single CSV line respecting quoted fields (RFC 4180).
 * Handles commas inside quoted values, e.g. "The Good, the Bad and the Ugly"
 */
function parseCsvLine(line: string): string[] {
  const cols: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        cols.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }
  cols.push(current.trim());
  return cols;
}

/**
 * Parse a Letterboxd CSV export into an array of BasicFilm objects.
 * Throws if required headers are missing.
 */
export function parseCsvToFilms(csvText: string): BasicFilm[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0].replace(/\r/g, ''));

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

  return lines
    .slice(1)
    .map((line) => {
      const cols = parseCsvLine(line.replace(/\r/g, ''));
      return {
        title: cols[nameIdx] ?? '',
        year: parseInt(cols[yearIdx]) || 0,
        letterboxdUrl: cols[uriIdx] ?? '',
        addedDate: cols[dateIdx] ?? '',
        description: '',
      };
    })
    .filter((f) => f.title);
}
