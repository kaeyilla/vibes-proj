/**
 * Due-Date Tinting Utility — Milestone 8 (Teammate B: Robert Flores)
 *
 * Implements the color-coding rules defined in DESIGN.md §2:
 *   - due-safe    (#10B981) : More than 2 days out
 *   - due-warning (#F59E0B) : Less than 24 hours / today
 *   - due-overdue (#EF4444) : Past due
 *   - due-neutral (#64748B) : Done (overrides date) or no due date
 */

export type DueState = 'due-neutral' | 'due-safe' | 'due-warning' | 'due-overdue';

export interface DueTintClasses {
  state: DueState;
  borderClass: string;
  badgeClass: string;
  dotClass: string;
  textClass: string;
  label: string;
}

/**
 * Determines the due date state for a given task.
 *
 * @param dueDate - ISO date string 'YYYY-MM-DD'
 * @param status - Current task status
 */
export function getDueState(
  dueDate?: string | null,
  status?: string
): DueState {
  // Done status overrides due date according to PRD & DESIGN.md §2
  if (status === 'done' || !dueDate) {
    return 'due-neutral';
  }

  // Parse YYYY-MM-DD in local time
  const parts = dueDate.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0])) {
    return 'due-neutral';
  }
  const [year, month, day] = parts;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDayStart = new Date(year, month - 1, day);

  const diffDays = Math.round(
    (targetDayStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Past due: alarm
  if (diffDays < 0) {
    return 'due-overdue';
  }

  // Less than 24 hours / today: warning
  if (diffDays <= 1) {
    return 'due-warning';
  }

  // More than 2 days out: calm
  return 'due-safe';
}

/**
 * Returns Tailwind CSS styling classes matching the due state token.
 */
export function getDueTintClasses(
  dueDate?: string | null,
  status?: string
): DueTintClasses {
  const state = getDueState(dueDate, status);

  switch (state) {
    case 'due-overdue':
      return {
        state,
        borderClass:
          'border-due-overdue/60 bg-due-overdue/[0.04] shadow-[0_0_12px_rgba(239,68,68,0.15)]',
        badgeClass: 'bg-due-overdue/15 text-due-overdue border-due-overdue/40',
        dotClass: 'bg-due-overdue',
        textClass: 'text-due-overdue',
        label: 'Past Due',
      };
    case 'due-warning':
      return {
        state,
        borderClass:
          'border-due-warning/60 bg-due-warning/[0.04] shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        badgeClass: 'bg-due-warning/15 text-due-warning border-due-warning/40',
        dotClass: 'bg-due-warning',
        textClass: 'text-due-warning',
        label: 'Less than 24h',
      };
    case 'due-safe':
      return {
        state,
        borderClass: 'border-due-safe/40 bg-surface-card hover:border-due-safe/80',
        badgeClass: 'bg-due-safe/15 text-due-safe border-due-safe/30',
        dotClass: 'bg-due-safe',
        textClass: 'text-due-safe',
        label: 'More than 2 Days',
      };
    case 'due-neutral':
    default:
      return {
        state,
        borderClass: 'border-border-subtle bg-surface-card',
        badgeClass: 'bg-surface-subtle text-text-muted border-border-subtle',
        dotClass: 'bg-due-neutral',
        textClass: 'text-due-neutral',
        label: status === 'done' ? 'Complete' : 'No deadline',
      };
  }
}

/**
 * Human-readable date formatter for badges.
 */
export function formatDueDate(dueDate?: string | null): string {
  if (!dueDate) return 'No due date';

  const parts = dueDate.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0])) return dueDate;
  const [year, month, day] = parts;

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
