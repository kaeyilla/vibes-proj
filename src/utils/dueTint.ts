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
          'border-red-300 bg-red-50/20 hover:border-red-400 shadow-sm',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        dotClass: 'bg-red-600',
        textClass: 'text-red-700',
        label: 'Past Due',
      };
    case 'due-warning':
      return {
        state,
        borderClass:
          'border-amber-300 bg-amber-50/20 hover:border-amber-400 shadow-sm',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-600',
        textClass: 'text-amber-700',
        label: 'Less than 24h',
      };
    case 'due-safe':
      return {
        state,
        borderClass: 'border-slate-200 bg-white hover:border-emerald-400 shadow-sm',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-600',
        textClass: 'text-emerald-700',
        label: 'More than 2 Days',
      };
    case 'due-neutral':
    default:
      return {
        state,
        borderClass: 'border-slate-200 bg-white hover:border-slate-300 shadow-sm',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        dotClass: 'bg-slate-400',
        textClass: 'text-slate-600',
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
