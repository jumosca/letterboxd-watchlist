'use client';

import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFilters } from '@/hooks/useFilters';
import FilmList from '@/components/FilmList';
import FilmDetail from '@/components/FilmDetail';
import PosterGrid from '@/components/PosterGrid';
import FilterBar from '@/components/FilterBar';
import CsvUpload from '@/components/CsvUpload';
import SyncButton from '@/components/SyncButton';

export default function Home() {
  const {
    films,
    loading,
    syncing,
    error,
    syncWatchlist,
    uploadAndSync,
    getLastSyncTime,
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

  return (
    <div
      className="flex flex-col md:flex-row h-screen overflow-hidden bg-white"
      style={{ fontFamily: 'var(--font-space-grotesk), Arial, sans-serif' }}
    >
      {/* ── Left panel (35%) ── */}
      <div className="w-full md:w-[35%] h-[45vh] md:h-auto border-b md:border-b-0 md:border-r border-black flex flex-col min-h-0 shrink-0">
        {/* Header */}
        <header className="border-b border-black p-4 shrink-0">
          <h1 className="text-base font-bold uppercase tracking-widest mb-1">
            My Watchlist
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            {films.length} films
            {filteredFilms.length !== films.length && ` · ${filteredFilms.length} showing`}
          </p>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <CsvUpload
              onUpload={uploadAndSync}
              uploading={syncing}
              error={error}
            />
            <SyncButton
              onSync={syncWatchlist}
              syncing={syncing}
              lastSyncTime={getLastSyncTime()}
              error={error}
            />
          </div>
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

      {/* ── Right panel (65%) ── */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          filterOptions={filterOptions}
          activeFilterCount={activeFilterCount}
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
