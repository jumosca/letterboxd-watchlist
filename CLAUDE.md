# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a web app to upload a csv file of a user's Letterboxd watchlist in CSV format. The app displays the films in the list, allows users to filter them according their needs, and pick a random film based on criteria.

## Commands

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
```

## Stack

- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4
- Tailwind imported via `@import "tailwindcss"` in globals.css (not `@tailwind` directives)
- Path alias: `@/*` → `./src/*`

## Environment Variables

```
NEXT_PUBLIC_TMDB_API_KEY=<tmdb_api_key>   # Required — get from themoviedb.org/settings/api
```

## Architecture

### Data Flow

```
CSV upload → CsvUpload component → uploadAndSync() in useWatchlist hook
  → POST /api/enrich (enriches BasicFilm[] with TMDB metadata + streaming)
  → Film[] cached in localStorage (TTL: 1 hour)
  → useFilters hook applies client-side filtering/sorting
  → UI renders
```

Differential sync: on re-upload, only new films (by Letterboxd URL) are sent to TMDB; cached films are preserved.

### Layout

Split-panel: left 35% (`FilmList`) / right 65% (`FilterBar` + `PosterGrid` or `FilmDetail`). Mobile stacks vertically.

`page.tsx` owns `selectedId` state — selecting a film swaps PosterGrid for FilmDetail in the right panel.

### Key Modules

- **`src/hooks/useWatchlist.ts`** — films state, localStorage caching, sync/upload logic, progress tracking
- **`src/hooks/useFilters.ts`** — FilterState (length, languages, decades, genres, streaming, sortBy/sortOrder), derives `filteredFilms` from films array
- **`src/lib/tmdb.ts`** — TMDB API client (search, details, watch providers). Rate-limited at 100ms between requests. Streaming filtered by country code (ES).
- **`src/lib/csv.ts`** — Client-side CSV parser. Required headers: Date, Name, Year, Letterboxd URI.
- **`src/app/api/enrich/route.ts`** — POST endpoint, validates input (max 5000 films, HTML stripping, year range 1880-2030), calls TMDB batch enrichment
- **`src/app/api/watchlist/route.ts`** — GET endpoint, reads `watchlist_export.csv` from project root

### Types (`src/lib/types.ts`)

- **`BasicFilm`** — parsed from CSV (title, year, letterboxdUrl, addedDate)
- **`Film`** — enriched with TMDB data (tmdbId, runtime, genres, posterPath, streaming, etc.)
- **`FilterState`** — sortBy is `'added' | 'title' | 'runtime' | 'year'` (no rating option)

## Design System

- Font: Space Grotesk (`--font-space-grotesk`)
- Palette: pure black/white, `border-black`, `text-black`, `bg-white`
- Labels: `uppercase tracking-widest text-xs`
- No border-radius on interactive elements (flat/editorial aesthetic)
- **Ratings are never displayed in UI** — stored in Film objects but intentionally hidden

## Retired Components

`WatchlistGrid.tsx`, `FilmCard.tsx`, `RandomPicker.tsx` — kept in repo but not rendered.
