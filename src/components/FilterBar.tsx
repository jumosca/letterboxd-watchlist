/**
 * FilterBar Component
 *
 * Comprehensive filtering and sorting controls for the watchlist
 */

'use client';

import { FilterState } from '@/lib/types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  onReset: () => void;
  filterOptions: {
    languages: string[];
    decades: number[];
    genres: string[];
  };
  activeFilterCount: number;
}

export default function FilterBar({
  filters,
  onFilterChange,
  onReset,
  filterOptions,
  activeFilterCount,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Filters & Sort
          {activeFilterCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({activeFilterCount} active)
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Length Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Runtime
          </label>
          <select
            value={filters.length}
            onChange={(e) =>
              onFilterChange(
                'length',
                e.target.value as FilterState['length']
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="any">Any length</option>
            <option value="short">&lt; 90 min</option>
            <option value="medium">90-120 min</option>
            <option value="long">120-150 min</option>
            <option value="verylong">&gt; 150 min</option>
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            multiple
            value={filters.languages}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              onFilterChange('languages', selected);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
          >
            {filterOptions.languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>

        {/* Decade Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decade
          </label>
          <select
            multiple
            value={filters.decades.map(String)}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (option) => parseInt(option.value)
              );
              onFilterChange('decades', selected);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
          >
            {filterOptions.decades.map((decade) => (
              <option key={decade} value={decade}>
                {decade}s
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            multiple
            value={filters.genres}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              onFilterChange('genres', selected);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
          >
            {filterOptions.genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>

        {/* Rating Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Rating
          </label>
          <select
            value={filters.ratingMin}
            onChange={(e) =>
              onFilterChange('ratingMin', parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ ⭐
              </option>
            ))}
          </select>
        </div>

        {/* Max Rating - Only show if user wants to set an upper limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Rating
          </label>
          <select
            value={filters.ratingMax}
            onChange={(e) =>
              onFilterChange('ratingMax', parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <option key={rating} value={rating}>
                {rating === 10 ? '10 (No max)' : `${rating}`} ⭐
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange('sortBy', e.target.value as FilterState['sortBy'])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="added">Recently Added</option>
            <option value="title">Title A-Z</option>
            <option value="rating">Rating</option>
            <option value="runtime">Runtime</option>
            <option value="year">Release Year</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) =>
              onFilterChange(
                'sortOrder',
                e.target.value as FilterState['sortOrder']
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>

        {/* Streaming Only Toggle */}
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyStreaming}
              onChange={(e) => onFilterChange('onlyStreaming', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Only show available in Spain
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
