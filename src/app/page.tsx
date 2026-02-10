/**
 * Main Watchlist Page
 *
 * Displays the user's Letterboxd watchlist with filtering and sorting
 */

'use client';

import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFilters } from '@/hooks/useFilters';
import WatchlistGrid from '@/components/WatchlistGrid';
import SyncButton from '@/components/SyncButton';
import FilterBar from '@/components/FilterBar';
import RandomPicker from '@/components/RandomPicker';
import CsvUpload from '@/components/CsvUpload';

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

  const [showRandomPicker, setShowRandomPicker] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Letterboxd Watchlist
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {films.length} films total
                {filteredFilms.length !== films.length &&
                  ` • ${filteredFilms.length} showing`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRandomPicker(true)}
                disabled={filteredFilms.length === 0}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${
                    filteredFilms.length === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}
              >
                🎲 Random Pick
              </button>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        {films.length > 0 && (
          <FilterBar
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            filterOptions={filterOptions}
            activeFilterCount={activeFilterCount}
          />
        )}

        {/* Watchlist Grid */}
        <WatchlistGrid
          films={filteredFilms}
          loading={loading}
          syncing={syncing}
        />
      </div>

      {/* Random Picker Modal */}
      {showRandomPicker && (
        <RandomPicker
          films={filteredFilms}
          onClose={() => setShowRandomPicker(false)}
        />
      )}
    </main>
  );
}
