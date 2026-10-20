import { getDueTintClasses, formatDueDate } from '../utils/dueTint';

/**
 * DueBadge Component — Milestone 8 (Teammate B: Robert Flores)
 *
 * Displays a task's due date with color tinting matching DESIGN.md §2:
 *   - due-safe    (#10B981)
 *   - due-warning (#F59E0B)
 *   - due-overdue (#EF4444)
 *   - due-neutral (#64748B)
 */
export default function DueBadge({ dueDate, status, showLabel = false }) {
  if (!dueDate && status !== 'done') {
    return null;
  }

  const { badgeClass, dotClass, label } = getDueTintClasses(dueDate, status);
  const formatted = formatDueDate(dueDate);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono border ${badgeClass}`}
      title={`Due: ${dueDate || 'None'} (${label})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      <span>{formatted}</span>
      {showLabel && <span className="opacity-75">· {label}</span>}
    </span>
  );
}
