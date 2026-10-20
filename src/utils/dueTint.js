/**
 * Due-Date Tinting Utility — Milestone 8 (Teammate B: Robert Flores)
 *
 * Implements the color-coding rules defined in DESIGN.md §2:
 *   - due-safe    (#10B981) : More than 2 days out
 *   - due-warning (#F59E0B) : Less than 24 hours / today
 *   - due-overdue (#EF4444) : Past due
 *   - due-neutral (#64748B) : Done (overrides date) or no due date
 */

/**
 * Determines the due date state for a given task.
 *
 * @param {string|null} dueDate - ISO date string 'YYYY-MM-DD'
 * @param {'todo'|'in-progress'|'review'|'done'} [status] - Current task status
 * @returns {'due-neutral'|'due-safe'|'due-warning'|'due-overdue'}
 */
export function getDueState(dueDate, status) {
  // Done status overrides due date according to DESIGN.md §2
  if (status === 'done' || !dueDate) {
    return 'due-neutral';
  }

  // Parse YYYY-MM-DD in local time to avoid timezone shifts
  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) {
    return 'due-neutral';
  }

  const targetDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  const now = new Date();

  // Reset now to today's start for day-difference comparisons
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDayStart = new Date(year, month - 1, day);

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil((targetDayStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

  // Past due
  if (diffTime < 0) {
    return 'due-overdue';
  }

  // Less than 24 hours / due today
  if (diffDays <= 1 || diffTime <= 24 * 60 * 60 * 1000) {
    return 'due-warning';
  }

  // More than 2 days out
  if (diffDays > 2) {
    return 'due-safe';
  }

  // 1-2 days out: falls into warning zone as deadline approaches
  return 'due-warning';
}

/**
 * Returns Tailwind CSS styling classes matching the due state token.
 *
 * @param {string|null} dueDate
 * @param {'todo'|'in-progress'|'review'|'done'} [status]
 * @returns {{
 *   state: 'due-neutral'|'due-safe'|'due-warning'|'due-overdue',
 *   borderClass: string,
 *   badgeClass: string,
 *   dotClass: string,
 *   textClass: string,
 *   label: string
 * }}
 */
export function getDueTintClasses(dueDate, status) {
  const state = getDueState(dueDate, status);

  switch (state) {
    case 'due-overdue':
      return {
        state,
        borderClass: 'border-due-overdue/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
        badgeClass: 'bg-due-overdue/10 text-due-overdue border-due-overdue/30',
        dotClass: 'bg-due-overdue animate-pulse',
        textClass: 'text-due-overdue',
        label: 'Overdue',
      };
    case 'due-warning':
      return {
        state,
        borderClass: 'border-due-warning/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        badgeClass: 'bg-due-warning/10 text-due-warning border-due-warning/30',
        dotClass: 'bg-due-warning',
        textClass: 'text-due-warning',
        label: 'Due soon',
      };
    case 'due-safe':
      return {
        state,
        borderClass: 'border-due-safe/40 hover:border-due-safe/80',
        badgeClass: 'bg-due-safe/10 text-due-safe border-due-safe/30',
        dotClass: 'bg-due-safe',
        textClass: 'text-due-safe',
        label: 'On track',
      };
    case 'due-neutral':
    default:
      return {
        state,
        borderClass: 'border-border-subtle hover:border-border-hover',
        badgeClass: 'bg-due-neutral/10 text-due-neutral border-due-neutral/20',
        dotClass: 'bg-due-neutral',
        textClass: 'text-due-neutral',
        label: status === 'done' ? 'Completed' : 'No deadline',
      };
  }
}

/**
 * Human-readable date formatter for badges.
 *
 * @param {string|null} dueDate
 * @returns {string}
 */
export function formatDueDate(dueDate) {
  if (!dueDate) return 'No due date';

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return dueDate;

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
