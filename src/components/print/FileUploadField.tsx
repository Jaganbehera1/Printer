import { CheckCircle2, FileText, Upload, X } from 'lucide-react';
import { useState, type ChangeEvent, type DragEvent } from 'react';
import Spinner from '@/components/ui/Spinner';
import { formatFileSize } from '@/utils/format';
import { ACCEPT_ATTRIBUTE } from '@/utils/fileValidation';

interface FileUploadFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
  maxFileSizeMb: number;
  disabled?: boolean;
}

export default function FileUploadField({ file, onChange, error, maxFileSizeMb, disabled }: FileUploadFieldProps) {
  const [dragging, setDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    onChange(event.dataTransfer.files?.[0] ?? null);
  };

  if (file) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4 rounded-2xl border border-success-200 bg-success-50 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-success-700 shadow-sm">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-900" title={file.name}>
              {file.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-success-800">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {formatFileSize(file.size)} - ready to print
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            aria-label="Remove file"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <p className="text-sm text-error-700" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? 'border-primary-500 bg-primary-50'
            : error
              ? 'border-error-300 bg-error-50/50'
              : 'border-neutral-300 bg-white hover:border-primary-400 hover:bg-primary-50/40'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          {disabled ? <Spinner className="text-primary-700" /> : <Upload className="h-6 w-6" aria-hidden="true" />}
        </span>
        <span>
          <span className="block text-base font-medium text-neutral-900">Tap to choose a file</span>
          <span className="mt-1 block text-sm text-neutral-500">
            PDF, Word, Excel, PowerPoint, text or image, up to {maxFileSizeMb} MB
          </span>
        </span>
        <input
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-label="Choose file to print"
        />
      </label>
      {error && (
        <p className="text-sm text-error-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
