import React, { useState } from 'react';
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
 * Collapsed by default so users uncollapse when needed.
 */
export default function AnchorBoard() {
  const [anchors, setAnchors] = useLocalStorage<Anchor[]>(
    'vibetracker.anchors',
    DEFAULT_ANCHORS
  );
  const [isCollapsed, setIsCollapsed] = useState(true);

  function handleUrlChange(id: AnchorId, newUrl: string) {
    const trimmed = newUrl.trim();
    setAnchors((prev: Anchor[]) =>
      prev.map((a: Anchor) => (a.id === id ? { ...a, url: trimmed || null } : a))
    );
  }

  const linkedCount = anchors.filter((a: Anchor) => Boolean(a.url)).length;

  return (
    <section
      aria-label="Deliverable Anchor Board"
      className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all overflow-hidden"
    >
      {/* Header bar acts as collapse toggle */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={!isCollapsed}
        aria-controls="deliverable-anchors-content"
        onClick={() => setIsCollapsed(!isCollapsed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }
        }}
        className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Deliverable Anchor Board
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-medium text-slate-500">
            {linkedCount} / 4 Anchors Linked
          </span>
          <button
            type="button"
            aria-label={isCollapsed ? 'Uncollapse Deliverable Anchor Board' : 'Collapse Deliverable Anchor Board'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-mono font-medium text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
          >
            <span>{isCollapsed ? 'Uncollapse' : 'Collapse'}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div
          id="deliverable-anchors-content"
          className="p-4 pt-0 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200"
        >
        {anchors.map((anchor: Anchor) => {
          const hasUrl = Boolean(anchor.url);

          return (
            <div
              key={anchor.id}
              className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all ${
                hasUrl
                  ? 'border-brand-primary/40 bg-purple-50/20 shadow-sm hover:border-brand-primary hover:shadow-md'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={hasUrl ? 'text-brand-primary' : 'text-slate-400'}>
                    {ANCHOR_ICONS[anchor.id]}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {anchor.label}
                  </span>
                </div>

                {/* Status indicator: empty / filled dot */}
                <div className="flex items-center gap-1.5" title={hasUrl ? 'Deliverable Linked' : 'Pending URL'}>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      hasUrl
                        ? 'bg-emerald-500 shadow-sm animate-pulse'
                        : 'border border-slate-300 bg-slate-200'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-slate-500">
                    {hasUrl ? 'Linked' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* URL Input with Accessible Label */}
              <div className="flex items-center gap-1.5 mt-1">
                <label htmlFor={`anchor-${anchor.id}`} className="sr-only">
                  {anchor.label} deliverable URL
                </label>
                <input
                  id={`anchor-${anchor.id}`}
                  type="url"
                  aria-label={`${anchor.label} deliverable URL`}
                  value={anchor.url || ''}
                  onChange={(e) => handleUrlChange(anchor.id, e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />

                {hasUrl && (
                  <a
                    href={anchor.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${anchor.label} link in new tab`}
                    title={`Open ${anchor.label}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-brand-primary/40 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </section>
  );
}
