/**
 * Watchlist API Route
 *
 * Reads watchlist data from the exported Letterboxd CSV file
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the exported CSV file from the project root
    const csvPath = join(process.cwd(), 'watchlist_export.csv');
    const csvText = readFileSync(csvPath, 'utf-8');

    const lines = csvText.trim().split('\n');
    const headers = lines[0].replace(/\r/g, '').split(',');

    // Find column indices
    const dateIdx = headers.indexOf('Date');
    const nameIdx = headers.indexOf('Name');
    const yearIdx = headers.indexOf('Year');
    const uriIdx = headers.indexOf('Letterboxd URI');

    const films = lines.slice(1).map(line => {
      // Strip Windows-style carriage returns and split on commas
      const clean_line = line.replace(/\r/g, '');
      const cols = clean_line.split(',');
      const clean = (s: string) => s?.replace(/^"|"$/g, '').trim() ?? '';

      return {
        title: clean(cols[nameIdx]),
        year: parseInt(clean(cols[yearIdx])) || 0,
        letterboxdUrl: clean(cols[uriIdx]),
        addedDate: clean(cols[dateIdx]),
        description: '',
      };
    }).filter(f => f.title);

    return NextResponse.json({ films, total: films.length });
  } catch (error) {
    console.error('Error reading watchlist CSV:', error);
    return NextResponse.json(
      {
        error: 'Failed to read watchlist CSV',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
