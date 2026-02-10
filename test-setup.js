/**
 * Quick test script to verify Letterboxd and TMDB API setup
 */

const Parser = require('rss-parser');
const axios = require('axios');

const LETTERBOXD_USERNAME = 'jmosca';
const TMDB_API_KEY = 'a6a279b8571e153aa9df673dd5c04bcd';

async function testLetterboxd() {
  console.log('\n🎬 Testing Letterboxd RSS feed...');
  try {
    const parser = new Parser();
    const rssUrl = `https://letterboxd.com/${LETTERBOXD_USERNAME}/watchlist/rss/`;
    const feed = await parser.parseURL(rssUrl);

    console.log('✅ Letterboxd RSS feed works!');
    console.log(`   Found ${feed.items.length} films in watchlist`);

    if (feed.items.length > 0) {
      const firstFilm = feed.items[0].title;
      console.log(`   Latest film: ${firstFilm}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Letterboxd RSS feed failed:', error.message);
    return false;
  }
}

async function testTMDB() {
  console.log('\n🎥 Testing TMDB API...');
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query: 'Inception',
        year: 2010
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      const movie = response.data.results[0];
      console.log('✅ TMDB API works!');
      console.log(`   Test search: "${movie.title}" (${movie.release_date?.substring(0, 4)})`);
      console.log(`   Rating: ${movie.vote_average}/10`);
    }

    return true;
  } catch (error) {
    console.error('❌ TMDB API failed:', error.message);
    if (error.response?.status === 401) {
      console.error('   → Check your API key');
    }
    return false;
  }
}

async function testStreamingAvailability() {
  console.log('\n📺 Testing Streaming Availability (Spain)...');
  try {
    // Get Inception's TMDB ID first
    const searchResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query: 'Inception',
        year: 2010
      }
    });

    const movieId = searchResponse.data.results[0].id;

    // Get watch providers
    const providersResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      {
        params: { api_key: TMDB_API_KEY }
      }
    );

    const spainData = providersResponse.data.results?.ES;

    if (spainData) {
      console.log('✅ Streaming availability data works!');

      if (spainData.flatrate) {
        const providers = spainData.flatrate.map(p => p.provider_name).join(', ');
        console.log(`   Available to stream in Spain on: ${providers}`);
      } else {
        console.log('   No streaming providers found for this film in Spain');
      }
    } else {
      console.log('⚠️  No streaming data available for Spain');
    }

    return true;
  } catch (error) {
    console.error('❌ Streaming availability test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Letterboxd Watchlist App Setup');
  console.log('=========================================');

  const letterboxdOk = await testLetterboxd();
  const tmdbOk = await testTMDB();
  const streamingOk = await testStreamingAvailability();

  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Letterboxd RSS: ${letterboxdOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`TMDB API: ${tmdbOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Streaming Data: ${streamingOk ? '✅ PASS' : '❌ FAIL'}`);

  if (letterboxdOk && tmdbOk && streamingOk) {
    console.log('\n🎉 All tests passed! Ready to build the app.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

runTests();
