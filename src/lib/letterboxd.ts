/**
 * Letterboxd RSS Parser
 *
 * Fetches and parses a user's Letterboxd watchlist RSS feed
 */

import Parser from 'rss-parser';
import { BasicFilm } from './types';

interface LetterboxdRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
}

interface LetterboxdRSSFeed {
  items: LetterboxdRSSItem[];
}

/**
 * Fetch and parse a user's Letterboxd watchlist RSS feed
 * Returns an array of basic film data (title, year, URL, added date)
 */
export async function fetchWatchlist(username: string): Promise<BasicFilm[]> {
  const parser = new Parser<LetterboxdRSSFeed>();
  const rssUrl = `https://letterboxd.com/${username}/watchlist/rss/`;

  try {
    const feed = await parser.parseURL(rssUrl);

    return feed.items
      .map((item) => {
        if (!item.title || !item.link) {
          return null;
        }

        // Extract year from title (format: "Movie Title (YYYY)")
        const match = item.title.match(/^(.+?)\s*\((\d{4})\)$/);
        const title = match ? match[1].trim() : item.title;
        const year = match ? parseInt(match[2], 10) : 0;

        return {
          title,
          year,
          letterboxdUrl: item.link,
          addedDate: item.pubDate || new Date().toISOString(),
          description: item.contentSnippet || item.content || '',
        };
      })
      .filter((item): item is BasicFilm => item !== null);
  } catch (error) {
    console.error('Failed to fetch Letterboxd watchlist:', error);
    throw new Error(
      `Could not fetch watchlist for user "${username}". Please check the username and try again.`
    );
  }
}

/**
 * Validate if a Letterboxd username exists by checking RSS feed availability
 */
export async function validateUsername(username: string): Promise<boolean> {
  try {
    await fetchWatchlist(username);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extract film slug from Letterboxd URL
 * Example: https://letterboxd.com/film/inception/ -> "inception"
 */
export function extractFilmSlug(letterboxdUrl: string): string | null {
  const match = letterboxdUrl.match(/letterboxd\.com\/film\/([^\/]+)\/?/);
  return match ? match[1] : null;
}
