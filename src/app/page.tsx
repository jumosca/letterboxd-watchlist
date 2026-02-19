'use client';

import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFilters } from '@/hooks/useFilters';
import FilmList from '@/components/FilmList';
import FilmDetail from '@/components/FilmDetail';
import PosterGrid from '@/components/PosterGrid';
import FilterBar from '@/components/FilterBar';
import CsvUpload from '@/components/CsvUpload';

export default function Home() {
  const {
    films,
    loading,
    syncing,
    error,
    uploadAndSync,
  } = useWatchlist();

  const {
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
    filteredFilms,
    activeFilterCount,
  } = useFilters(films);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedFilm = filteredFilms.find((f) => f.tmdbId === selectedId) ?? null;

  function handleRandomPick() {
    if (filteredFilms.length === 0) return;
    const random = filteredFilms[Math.floor(Math.random() * filteredFilms.length)];
    setSelectedId(random.tmdbId);
  }

  return (
    <div
      className="flex flex-col md:flex-row h-screen overflow-hidden bg-white"
      style={{ fontFamily: 'var(--font-space-grotesk), Arial, sans-serif' }}
    >
      {/* ── Left panel (35%) — hidden on mobile ── */}
      <div className="hidden md:flex md:w-[35%] md:h-auto border-r border-black flex-col min-h-0 shrink-0">
        {/* Header */}
        <header className="border-b border-black p-4 shrink-0">
          <img
            src="/watchlist.gif"
            alt=""
            className="w-full object-contain mb-3"
          />
          <h1 className="text-base font-bold uppercase tracking-widest mb-1">
            What Am I Watching Tonight
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            {films.length} films
            {filteredFilms.length !== films.length && ` · ${filteredFilms.length} showing`}
          </p>

          {/* Controls */}
          <CsvUpload
            onUpload={uploadAndSync}
            uploading={syncing}
            error={error}
          />
        </header>

        {/* Scrollable film list */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <FilmList
            films={filteredFilms}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>

      {/* ── Right panel (65% on desktop, full on mobile) ── */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile header */}
        <header className="md:hidden border-b border-black p-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <img
              src="/watchlist_mobile_view.png"
              alt=""
              className="h-12 object-contain"
            />
            <CsvUpload
              onUpload={uploadAndSync}
              uploading={syncing}
              error={error}
            />
          </div>
        </header>
        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          onRandomPick={handleRandomPick}
          filterOptions={filterOptions}
          activeFilterCount={activeFilterCount}
          filmCount={filteredFilms.length}
        />

        {/* Content: detail or poster grid */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {selectedFilm ? (
            <FilmDetail
              film={selectedFilm}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <PosterGrid
              films={filteredFilms}
              onSelect={setSelectedId}
              loading={loading}
              syncing={syncing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
