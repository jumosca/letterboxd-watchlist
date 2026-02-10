# Letterboxd Watchlist Web App - Implementation Plan

## Context

This project creates a personal web application to manage and explore a Letterboxd watchlist with enhanced filtering, streaming availability, and discovery features. The user has a large watchlist and wants better tools to:

1. **Filter and discover films** based on multiple criteria (length, language, decade, rating, genre)
2. **Find where to watch** films in Spain across streaming platforms
3. **Randomly pick films** with optional filter criteria to help decide what to watch
4. **Sync periodically** (manual weekly refresh) to keep the watchlist up-to-date

**Why these choices matter:**
- Letterboxd's official API restricts access for private/personal projects, so we'll use their public RSS feeds instead
- The dataset is small and updates infrequently, so client-side caching with localStorage is sufficient (no database needed initially)
- Next.js with Vercel deployment provides the easiest path to a production web app with excellent developer experience
- TMDB API is completely free for non-commercial use with generous rate limits (40 req/sec) and provides both film metadata and streaming availability for Spain

## Tech Stack

- **Framework:** Next.js 14+ with App Router and TypeScript
- **Styling:** Tailwind CSS with Headless UI components
- **State Management:** Zustand (lightweight) + React hooks
- **Data Sources:**
  - Letterboxd RSS feed (`https://letterboxd.com/{username}/watchlist/rss/`)
  - TMDB API for film metadata and streaming availability
- **Storage:** localStorage for caching (no database initially)
- **Deployment:** Vercel (one-click deployment)

## Project Structure

```
letterboxd/
├── .env.local                          # TMDB API key
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Main watchlist page
│   │   ├── api/
│   │   │   ├── watchlist/route.ts     # Fetch Letterboxd RSS
│   │   │   ├── streaming/route.ts     # Get TMDB streaming data
│   │   │   └── enrich/route.ts        # Enrich films with TMDB
│   │   └── globals.css
│   ├── components/
│   │   ├── WatchlistGrid.tsx          # Display films in grid
│   │   ├── FilmCard.tsx               # Individual film card
│   │   ├── FilterBar.tsx              # Filtering controls
│   │   ├── RandomPicker.tsx           # Random film selector
│   │   ├── SyncButton.tsx             # Manual refresh button
│   │   └── StreamingBadges.tsx        # Show streaming platforms
│   ├── lib/
│   │   ├── letterboxd.ts              # RSS parsing logic
│   │   ├── tmdb.ts                    # TMDB API client
│   │   ├── storage.ts                 # localStorage utilities
│   │   └── types.ts                   # TypeScript interfaces
│   ├── hooks/
│   │   ├── useWatchlist.ts            # Watchlist data management
│   │   └── useFilters.ts              # Filter state management
│   └── config/
│       └── app.config.ts              # App config (hardcoded username)
```

## Data Flow

1. **User clicks "Sync Watchlist" button**
2. **Fetch RSS feed** from `https://letterboxd.com/{username}/watchlist/rss/`
3. **Parse XML** to extract film titles, years, and Letterboxd URLs
4. **For each film:**
   - Search TMDB by title + year to get movie ID
   - Fetch movie details (runtime, genres, ratings, languages)
   - Fetch streaming availability for Spain (country code "ES")
5. **Combine into Film objects** and cache in localStorage
6. **Display enriched data** in the UI with filters/sorting

## Core Features Implementation

### 1. Manual Sync Button
- Component: `SyncButton.tsx`
- Shows last sync timestamp
- Displays progress during enrichment ("Enriching 15/42 films...")
- Bypasses cache and fetches fresh data
- Error handling with user notifications

### 2. Filtering & Sorting
- Component: `FilterBar.tsx`
- **Filters:**
  - Length: < 90min, 90-120min, 120-150min, > 150min
  - Language: Multi-select dropdown (Spanish, English, etc.)
  - Decade: Multi-select (1950s-2020s)
  - Rating: Range slider (0-10 TMDB rating)
  - Genre: Multi-select chips (Action, Drama, etc.)
  - Streaming: Toggle "Only show available in Spain"
- **Sorting:** Recently added, Title A-Z, Rating, Runtime, Release year

### 3. Streaming Availability Display
- Component: `StreamingBadges.tsx`
- Show provider logos (Netflix, Prime Video, HBO Max, etc.)
- Indicate type: Stream, Rent, Buy
- Link directly to provider
- Show "Not available in Spain" if no providers

### 4. Random Film Picker
- Component: `RandomPicker.tsx`
- Large "Pick Random Film" button
- Apply current filters to random selection
- Animated selection with visual feedback
- Show picked film in modal with streaming options
- "Pick Another" button

## Critical Files

The following files form the core data pipeline and must be implemented first:

1. **`src/lib/types.ts`** - TypeScript interfaces for Film, StreamingData, FilterState, and all data structures
2. **`src/lib/tmdb.ts`** - TMDB API client (search movies, fetch details, get watch providers)
3. **`src/lib/letterboxd.ts`** - RSS parser to fetch and parse Letterboxd watchlist feed
4. **`src/app/api/enrich/route.ts`** - API route to orchestrate enrichment (RSS → TMDB → combined data)
5. **`src/hooks/useWatchlist.ts`** - React hook managing watchlist state, caching, and sync operations
6. **`src/lib/storage.ts`** - localStorage utilities for caching watchlist data
7. **`src/config/app.config.ts`** - Configuration file with hardcoded Letterboxd username and TMDB settings

## Required NPM Packages

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "rss-parser": "^3.13.0",
    "axios": "^1.7.0",
    "zustand": "^4.5.0",
    "tailwindcss": "^3.4.0",
    "@headlessui/react": "^2.0.0",
    "@heroicons/react": "^2.1.0",
    "date-fns": "^3.3.0"
  }
}
```

## Implementation Phases

### Phase 1: Project Setup & Core Data Layer (Days 1-2)
1. Initialize Next.js project with TypeScript and Tailwind
2. Install required dependencies
3. Create type definitions (`types.ts`)
4. Implement TMDB client (`tmdb.ts`)
5. Create RSS parser (`letterboxd.ts`)
6. Build API routes for enrichment
7. Implement localStorage utilities (`storage.ts`)

### Phase 2: Hooks & State Management (Day 3)
8. Create `useWatchlist` hook with sync functionality
9. Create `useFilters` hook for filter state
10. Test end-to-end data flow (RSS → TMDB → cache)

### Phase 3: Core UI Components (Days 4-5)
11. Build basic layout and page structure
12. Create `FilmCard` component with poster and metadata
13. Create `WatchlistGrid` with responsive layout
14. Implement `SyncButton` with loading states
15. Create `StreamingBadges` component

### Phase 4: Advanced Features (Days 6-7)
16. Build `FilterBar` with all filter options
17. Implement filtering and sorting logic
18. Create `RandomPicker` with animations
19. Add URL query param persistence for filters

### Phase 5: Polish & Deployment (Day 8)
20. Add loading skeletons and error states
21. Responsive design testing and fixes
22. Performance optimization (lazy loading, memoization)
23. Deploy to Vercel with environment variables

## Environment Setup

### 1. TMDB API Key
- Create account at https://www.themoviedb.org/signup
- Go to Settings → API → Request API Key
- Copy API Key (v3 auth)
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_TMDB_API_KEY=your_key_here
  ```

### 2. Letterboxd Username
- Edit `src/config/app.config.ts`:
  ```typescript
  export const appConfig = {
    letterboxd: {
      username: 'your-username-here',
    },
    ...
  };
  ```

### 3. Vercel Deployment
- Connect GitHub repository to Vercel
- Add `NEXT_PUBLIC_TMDB_API_KEY` environment variable
- Deploy automatically on push to main branch

## Key Architectural Decisions

### Why RSS instead of Letterboxd API?
- Letterboxd API denies access for private/personal projects
- RSS feeds are officially provided and stable
- Easier to parse (structured XML) than web scraping
- No API application process needed

### Why localStorage instead of database?
- Small dataset (typically < 500 films)
- Single user with hardcoded username
- Infrequent updates (manual weekly sync)
- No hosting costs
- Fast development
- Easy migration to database later when adding multi-user support

### Why TMDB API?
- Completely free for non-commercial use
- Generous rate limits (40 requests/second)
- Provides both film metadata AND streaming availability
- Country-specific filtering (Spain: "ES")
- Well-documented with good data quality

### Why Next.js App Router?
- Modern Next.js standard (14+)
- Better TypeScript support
- Server Components reduce client bundle
- API routes as serverless functions (perfect for Vercel)
- Excellent developer experience

## Potential Challenges & Solutions

### Challenge: TMDB movie matching accuracy
**Solution:** Search with title + year, fall back to fuzzy search, use year to disambiguate

### Challenge: Missing streaming data for some films
**Solution:** Show "Not available in Spain" message, provide manual search link

### Challenge: Large watchlists (100+ films)
**Solution:** Batch TMDB API calls with delays (20 at a time), implement virtual scrolling if needed

### Challenge: Stale streaming availability data
**Solution:** Show last sync timestamp prominently, suggest refresh if > 24 hours old

## Future Extensibility

### Adding Multi-User Support (Public Version)
1. Add database (Vercel Postgres or Supabase)
2. Implement NextAuth.js for authentication
3. Store per-user watchlist data in database
4. Modify config to read from user session
5. Add user-specific API routes with authentication checks

### Additional Features
- Mark films as watched and track history
- Add personal notes and ratings
- Export watchlist to CSV/JSON
- Notifications when films become available on streaming
- Multiple lists (favorites, to-rewatch)
- Recommendations based on watchlist

## Verification & Testing

### Initial Setup Verification
1. Run `npm install` successfully
2. TMDB API key works: test with simple fetch to `/search/movie`
3. Letterboxd RSS feed accessible: visit `https://letterboxd.com/{username}/watchlist/rss/` in browser

### Feature Testing Checklist
- [ ] Sync button fetches RSS feed and enriches with TMDB data
- [ ] Films display in grid with posters, titles, ratings
- [ ] All filters work correctly (length, language, decade, rating, genre)
- [ ] Sorting options function properly
- [ ] Streaming badges show correct providers for Spain
- [ ] Random picker selects films and respects filters
- [ ] Data persists in localStorage between sessions
- [ ] Last sync timestamp displays correctly
- [ ] Loading states show during sync
- [ ] Error handling works (invalid username, API failures)
- [ ] Responsive design works on mobile and desktop
- [ ] Vercel deployment succeeds and environment variables load

### End-to-End Test Flow
1. Open app in browser
2. Click "Sync Watchlist" button
3. Verify loading state shows progress
4. Confirm films appear in grid with all metadata
5. Apply multiple filters and verify results
6. Click random picker and verify selection
7. Check streaming badges show correct platforms
8. Refresh page and verify data persists
9. Deploy to Vercel and test production build

## Success Criteria

The implementation will be complete when:
1. User can sync their Letterboxd watchlist with one click
2. All films display with posters, metadata, and streaming availability
3. All filter and sort options work correctly
4. Random picker selects films based on active filters
5. Data caches properly in localStorage
6. App deploys successfully to Vercel
7. Mobile responsive design works well
8. No console errors or warnings in production build
