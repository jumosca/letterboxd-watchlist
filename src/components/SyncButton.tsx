'use client';

interface SyncButtonProps {
  onSync: () => Promise<unknown>;
  syncing: boolean;
  lastSyncTime: string | null;
  error: string | null;
}

export default function SyncButton({ onSync, syncing, lastSyncTime, error }: SyncButtonProps) {
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={onSync}
        disabled={syncing}
        className="text-xs uppercase tracking-widest border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {syncing ? 'Syncing…' : 'Sync'}
      </button>
      {lastSyncTime && !error && (
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {lastSyncTime}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
