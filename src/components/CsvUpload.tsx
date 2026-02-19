'use client';

import { useRef } from 'react';

interface CsvUploadProps {
  onUpload: (file: File) => void;
  uploading: boolean;
  error?: string | null;
}

export default function CsvUpload({ onUpload, uploading, error }: CsvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onUpload(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv,text/plain,application/csv"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs uppercase tracking-widest border border-black bg-black text-white px-3 py-1.5 hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading…' : 'Upload CSV'}
      </button>
      {error && (
        <p className="text-xs text-red-600 max-w-[160px]">{error}</p>
      )}
    </div>
  );
}
