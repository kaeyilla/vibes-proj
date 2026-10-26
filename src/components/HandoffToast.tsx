import { useEffect } from 'react';

interface HandoffToastProps {
  message: string | null;
  onDismiss: () => void;
}

/**
 * HandoffToast — Milestone 7 (task-owner)
 *
 * Visual acknowledgment when a task is reassigned.
 * Microcopy from DESIGN.md §5:
 *   "Task handed off to {name}. Context is synced."
 * 200ms fade transition per DESIGN.md §7.
 */
export default function HandoffToast({ message, onDismiss }: HandoffToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl transition-opacity duration-200 animate-in fade-in slide-in-from-bottom-2"
    >
      {/* Sync pulse icon */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-brand-primary">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-lg bg-brand-primary/20 opacity-75" />
        <svg className="relative h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>

      <div className="pr-2">
        <p className="text-xs font-bold text-slate-800">
          {message.includes('copied') || message.includes('Prompt')
            ? 'Context Copied'
            : 'Ownership Handoff'}
        </p>
        <p className="text-xs text-slate-600 font-medium">{message}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        aria-label="Dismiss notification"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
