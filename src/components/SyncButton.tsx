/**
 * SyncButton Component
 *
 * Button to manually sync the watchlist with loading states and last sync time
 */

'use client';

interface SyncButtonProps {
  onSync: () => Promise<any>;
  syncing: boolean;
  lastSyncTime: string | null;
  error: string | null;
}

export default function SyncButton({
  onSync,
  syncing,
  lastSyncTime,
  error,
}: SyncButtonProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={onSync}
        disabled={syncing}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-colors
          ${
            syncing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {syncing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Syncing...
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Sync Watchlist
          </>
        )}
      </button>

      {lastSyncTime && (
        <p className="text-xs text-gray-500">
          Last synced: {lastSyncTime}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
