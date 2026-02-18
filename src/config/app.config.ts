/**
 * Application configuration
 *
*/

export const appConfig = {
  letterboxd: {
    username: 'jmosca',
  },
  tmdb: {
    apiKey: process.env.TMDB_API_KEY || '',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
    countryCode: 'ES', // Spain
  },
  cache: {
    ttl: 3600000, // 1 hour in milliseconds
  },
} as const;
