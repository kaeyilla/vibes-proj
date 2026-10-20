import React, { useState } from 'react';
import { TEAM, type Assignee, type Task } from '../models/task';
import { getTeammateTheme, getInitials } from './TeammateStrip';
import { getDueTintClasses } from '../utils/dueTint';
import { serializePromptContext } from '../utils/contextHelper';
import { playPickupSound } from '../utils/soundEffects';

interface TaskCardProps {
  task: Task;
  onSelect?: (task: Task) => void;
  onHandoff?: (taskId: string, newAssignee: Assignee) => void;
  onCopySuccess?: (message: string) => void;
}

/** '2026-10-20' → '20 Oct'. Parsed as a LOCAL date to avoid UTC off-by-one. */
function formatDue(iso?: string | null): string {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0])) return iso;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TaskCard({
  task,
  onSelect,
  onHandoff,
  onCopySuccess,
}: TaskCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const assigneeName = task?.assignee || 'Unassigned';
  const theme = getTeammateTheme(assigneeName);
  const isBug = task?.type === 'bug';

  // Milestone 8: due-tint time-based state and styling
  const dueTint = getDueTintClasses(task.dueDate, task.status);

  function handleHandoffChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    const newAssignee = e.target.value as Assignee;
    if (newAssignee && newAssignee !== task.assignee && onHandoff) {
      onHandoff(task.id, newAssignee);
    }
  }

  // Milestone 10: Copy Context button handler
  async function handleCopyContext(e: React.MouseEvent) {
    e.stopPropagation();
    const markdown = serializePromptContext(task);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopySuccess) {
        onCopySuccess('Prompt context copied. Ready to paste into AI.');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    playPickupSound();
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  return (
    <article
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onSelect ? () => onSelect(task) : undefined}
      className={`group relative rounded-xl border p-3.5 transition-all duration-150 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-[0_0_18px_-6px_rgba(6,182,212,0.45)] ${
        dueTint.borderClass
      } ${
        isBug
          ? 'border-l-4 border-l-type-bug'
          : 'border-l-4 border-l-type-feature'
      } ${
        isDragging
          ? 'opacity-40 scale-95 ring-2 ring-brand-accent shadow-2xl'
          : ''
      }`}
    >
      {/* Header: Title + M6 tag-style visual distinction */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          {/* Subtle drag handle indicator */}
          <span
            className="mt-0.5 text-text-muted/40 group-hover:text-brand-accent/60 transition-colors shrink-0"
            title="Drag task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
          </span>
          <h3 className="text-sm font-medium leading-snug text-text-primary group-hover:text-brand-accent transition-colors truncate">
            {task.title || 'Untitled Task'}
          </h3>
        </div>

        {/* Milestone 6: Feature vs Bug badge with icon and distinct color */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
            isBug
              ? 'bg-type-bug/15 text-type-bug border border-type-bug/35'
              : 'bg-type-feature/15 text-type-feature border border-type-feature/35'
          }`}
        >
          {isBug ? (
            <svg
              className="h-3 w-3 text-type-bug"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg
              className="h-3 w-3 text-type-feature"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          <span>{task.type || 'feature'}</span>
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
          {task.description}
        </p>
      )}

      {/* Due date badge (Milestone 8 due-tint) */}
      {task.dueDate ? (
        <div className="mt-2.5 flex items-center justify-between gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-mono border ${dueTint.badgeClass}`}
            title={`Due date: ${task.dueDate} (${dueTint.label})`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${dueTint.dotClass}`}
              aria-hidden="true"
            />
            <span>{formatDue(task.dueDate)}</span>
            <span className="opacity-80">· {dueTint.label}</span>
          </span>

          {/* Milestone 10: "Copy Context" button on card */}
          <button
            type="button"
            onClick={handleCopyContext}
            title="Copy prompt context briefing for AI"
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-mono transition ${
              copied
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-border-subtle bg-surface-page/90 text-text-muted hover:border-brand-accent hover:text-brand-accent'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Context</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-2.5 flex justify-end">
          {/* Milestone 10: "Copy Context" button even if no due date */}
          <button
            type="button"
            onClick={handleCopyContext}
            title="Copy prompt context briefing for AI"
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-mono transition ${
              copied
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-border-subtle bg-surface-page/90 text-text-muted hover:border-brand-accent hover:text-brand-accent'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Context</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer: Prominent Assignee Badge + "Hand off to..." Dropdown (M7 task-owner) */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-2.5 font-mono text-[11px] text-text-muted">
        {/* Prominent Assignee Avatar Badge */}
        <div
          className="flex items-center gap-1.5"
          title={`Assigned to ${assigneeName}`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold border ${theme.bg} ${theme.text} ${theme.border}`}
          >
            {getInitials(assigneeName)}
          </span>
          <span className="font-sans text-xs font-medium text-text-primary">
            {assigneeName.split(' ')[0]}
          </span>
        </div>

        {/* Hand off to dropdown */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <label htmlFor={`handoff-${task.id}`} className="sr-only">
            Hand off task
          </label>
          <select
            id={`handoff-${task.id}`}
            value={task.assignee}
            onChange={handleHandoffChange}
            aria-label="Hand off to..."
            className="rounded border border-border-subtle bg-surface-page/80 px-2 py-1 text-[10px] text-text-muted transition hover:border-brand-accent hover:text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer"
          >
            <option disabled value="">
              Hand off to...
            </option>
            {TEAM.map((member) => (
              <option key={member} value={member}>
                → {member.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </article>
  );
}
