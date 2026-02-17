'use client';

import { FilterState } from '@/lib/types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  filterOptions: {
    languages: string[];
    decades: number[];
    genres: string[];
  };
  activeFilterCount: number;
}

// Combined sort options (sortBy + sortOrder encoded as a single value)
const SORT_OPTIONS = [
  { label: 'Recently Added',  sortBy: 'added',   sortOrder: 'desc' },
  { label: 'Oldest Added',    sortBy: 'added',   sortOrder: 'asc'  },
  { label: 'Title A → Z',    sortBy: 'title',   sortOrder: 'asc'  },
  { label: 'Title Z → A',    sortBy: 'title',   sortOrder: 'desc' },
  { label: 'Year ↑',          sortBy: 'year',    sortOrder: 'asc'  },
  { label: 'Year ↓',          sortBy: 'year',    sortOrder: 'desc' },
  { label: 'Runtime ↑',       sortBy: 'runtime', sortOrder: 'asc'  },
  { label: 'Runtime ↓',       sortBy: 'runtime', sortOrder: 'desc' },
] as const;

export default function FilterBar({
  filters,
  onFilterChange,
  onReset,
  filterOptions,
  activeFilterCount,
}: FilterBarProps) {
  const currentSortKey = `${filters.sortBy}-${filters.sortOrder}`;

  function handleSortChange(value: string) {
    const opt = SORT_OPTIONS.find((o) => `${o.sortBy}-${o.sortOrder}` === value);
    if (!opt) return;
    onFilterChange('sortBy', opt.sortBy);
    onFilterChange('sortOrder', opt.sortOrder);
  }

  const selectClass =
    'bg-white border border-black text-xs uppercase tracking-widest px-2 py-1.5 focus:outline-none focus:ring-0 appearance-none cursor-pointer hover:bg-black hover:text-white transition-colors';

  return (
    <div className="border-b border-black px-4 py-2 flex flex-wrap items-center gap-3 shrink-0 bg-white">
      {/* Sort */}
      <select
        value={currentSortKey}
        onChange={(e) => handleSortChange(e.target.value)}
        className={selectClass}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={`${opt.sortBy}-${opt.sortOrder}`} value={`${opt.sortBy}-${opt.sortOrder}`}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Runtime */}
      <select
        value={filters.length}
        onChange={(e) => onFilterChange('length', e.target.value as FilterState['length'])}
        className={selectClass}
      >
        <option value="any">Any runtime</option>
        <option value="short">&lt; 90 min</option>
        <option value="medium">90–120 min</option>
        <option value="long">120–150 min</option>
        <option value="verylong">&gt; 150 min</option>
      </select>

      {/* Language */}
      <select
        value={filters.languages[0] ?? ''}
        onChange={(e) =>
          onFilterChange('languages', e.target.value ? [e.target.value] : [])
        }
        className={selectClass}
      >
        <option value="">Any language</option>
        {filterOptions.languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      {/* Decade */}
      <select
        value={filters.decades[0]?.toString() ?? ''}
        onChange={(e) =>
          onFilterChange('decades', e.target.value ? [parseInt(e.target.value)] : [])
        }
        className={selectClass}
      >
        <option value="">Any decade</option>
        {filterOptions.decades.map((d) => (
          <option key={d} value={d}>{d}s</option>
        ))}
      </select>

      {/* Genre */}
      <select
        value={filters.genres[0] ?? ''}
        onChange={(e) =>
          onFilterChange('genres', e.target.value ? [e.target.value] : [])
        }
        className={selectClass}
      >
        <option value="">Any genre</option>
        {filterOptions.genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Streaming toggle */}
      <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors border border-black px-2 py-1.5">
        <input
          type="checkbox"
          checked={filters.onlyStreaming}
          onChange={(e) => onFilterChange('onlyStreaming', e.target.checked)}
          className="w-3.5 h-3.5 accent-black"
        />
        Streaming
      </label>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={onReset}
          className="text-xs uppercase tracking-widest text-gray-500 hover:text-black ml-auto"
        >
          Clear ({activeFilterCount})
        </button>
      )}
    </div>
  );
}
