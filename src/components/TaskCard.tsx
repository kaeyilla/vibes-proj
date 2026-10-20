import React from 'react';
import { TEAM, type Assignee, type Task } from '../models/task';
import { getTeammateTheme, getInitials } from './TeammateStrip';

interface TaskCardProps {
  task: Task;
  onSelect?: (task: Task) => void;
  onHandoff?: (taskId: string, newAssignee: Assignee) => void;
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

export default function TaskCard({ task, onSelect, onHandoff }: TaskCardProps) {
  const assigneeName = task?.assignee || 'Unassigned';
  const theme = getTeammateTheme(assigneeName);
  const isBug = task?.type === 'bug';

  function handleHandoffChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    const newAssignee = e.target.value as Assignee;
    if (newAssignee && newAssignee !== task.assignee && onHandoff) {
      onHandoff(task.id, newAssignee);
    }
  }

  return (
    <article
      onClick={onSelect ? () => onSelect(task) : undefined}
      className={`group relative rounded-xl border border-border-subtle bg-surface-card p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-accent/40 hover:bg-surface-card-hover hover:shadow-[0_0_18px_-6px_rgba(6,182,212,0.45)] ${
        isBug
          ? 'border-l-4 border-l-type-bug'
          : 'border-l-4 border-l-type-feature'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Header: Title + M6 tag-style visual distinction */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug text-text-primary group-hover:text-brand-accent transition-colors">
          {task.title || 'Untitled Task'}
        </h3>

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

      {/* Footer: Prominent Assignee Badge + "Hand off to..." Dropdown (M7 task-owner) */}
      <footer className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-2.5 font-mono text-[11px] text-text-muted">
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

        {/* Due date */}
        {task.dueDate ? (
          <div className="w-full text-right text-[10px] text-text-muted opacity-80">
            <time dateTime={task.dueDate}>Due {formatDue(task.dueDate)}</time>
          </div>
        ) : null}
      </footer>
    </article>
  );
}
