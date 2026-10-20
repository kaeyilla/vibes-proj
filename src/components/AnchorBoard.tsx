import React from 'react';
import { DEFAULT_ANCHORS, type Anchor, type AnchorId } from '../models/task';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ANCHOR_ICONS: Record<AnchorId, React.ReactNode> = {
  presentation: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  demo: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  report: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  documentation: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

/**
 * Deliverable Anchor Board — Milestone 11 (project-deliverables)
 *
 * Pinned banner above the Kanban board for tracking the four final-project deliverables:
 * Presentation, Demo, Report, Documentation.
 * Includes URL inputs, active/empty status dots, and direct external launch buttons.
 * Persisted to localStorage ('vibetracker.anchors').
 */
export default function AnchorBoard() {
  const [anchors, setAnchors] = useLocalStorage<Anchor[]>(
    'vibetracker.anchors',
    DEFAULT_ANCHORS
  );

  function handleUrlChange(id: AnchorId, newUrl: string) {
    const trimmed = newUrl.trim();
    setAnchors((prev: Anchor[]) =>
      prev.map((a: Anchor) => (a.id === id ? { ...a, url: trimmed || null } : a))
    );
  }

  return (
    <section
      aria-label="Deliverable Anchor Board"
      className="mb-6 rounded-2xl border border-border-subtle bg-surface-card/70 p-4 shadow-xl backdrop-blur-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-accent/20 text-brand-accent">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Deliverable Anchor Board
          </h2>
          <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            Milestone 11
          </span>
        </div>

        <span className="font-mono text-[11px] text-text-muted">
          {anchors.filter((a: Anchor) => Boolean(a.url)).length} / 4 Anchors Linked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {anchors.map((anchor: Anchor) => {
          const hasUrl = Boolean(anchor.url);

          return (
            <div
              key={anchor.id}
              className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all ${
                hasUrl
                  ? 'border-brand-accent/40 bg-surface-card hover:border-brand-accent hover:shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]'
                  : 'border-border-subtle bg-surface-page/50 hover:border-border-hover'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={hasUrl ? 'text-brand-accent' : 'text-text-muted'}>
                    {ANCHOR_ICONS[anchor.id]}
                  </span>
                  <span className="text-xs font-semibold text-text-primary">
                    {anchor.label}
                  </span>
                </div>

                {/* Status indicator: empty / filled dot */}
                <div className="flex items-center gap-1.5" title={hasUrl ? 'Deliverable Linked' : 'Pending URL'}>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      hasUrl
                        ? 'bg-brand-accent shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse'
                        : 'border border-border-hover bg-surface-subtle'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-text-muted">
                    {hasUrl ? 'Linked' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  id={`anchor-${anchor.id}`}
                  type="url"
                  value={anchor.url || ''}
                  onChange={(e) => handleUrlChange(anchor.id, e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-border-subtle bg-surface-page px-2.5 py-1 text-xs font-mono text-text-primary placeholder:text-slate-600 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />

                {hasUrl && (
                  <a
                    href={anchor.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${anchor.label}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-brand-accent/40 bg-brand-accent/15 text-brand-accent hover:bg-brand-accent hover:text-white transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
