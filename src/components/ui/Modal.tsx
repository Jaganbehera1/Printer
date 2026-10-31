import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-primary-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-5 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-neutral-200 bg-white shadow-2xl sm:max-h-[90dvh] sm:max-w-3xl sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3.5 sm:px-6 sm:py-4">
          <h2 className="min-w-0 break-words text-base font-semibold text-neutral-900 sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">{children}</div>
      </div>
    </div>
  );
}
