import { TEAM, type Assignee, type Task } from '../models/task';

interface TeammateStripProps {
  tasks: Task[];
  selectedTeammate: Assignee | null;
  onSelectTeammate: (teammate: Assignee | null) => void;
}

export const TEAMMATE_THEMES: Record<
  string,
  { bg: string; text: string; border: string; glow: string }
> = {
  Reuben: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    glow: 'rgba(123,88,207,0.2)',
  },
  Ken: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    glow: 'rgba(252,109,38,0.2)',
  },
  Sam: {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-300',
    glow: 'rgba(14,165,233,0.2)',
  },
  King: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    glow: 'rgba(16,185,129,0.2)',
  },
  'Kaenawah Yilla': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    glow: 'rgba(123,88,207,0.2)',
  },
  'Robert Flores': {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    glow: 'rgba(252,109,38,0.2)',
  },
  'Juliette Ortega': {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-300',
    glow: 'rgba(14,165,233,0.2)',
  },
  'Maguette Seck': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    glow: 'rgba(16,185,129,0.2)',
  },
};

export function getTeammateTheme(name: string) {
  return (
    TEAMMATE_THEMES[name] || {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-300',
      glow: 'rgba(123,88,207,0.2)',
    }
  );
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}

/**
 * TeammateStrip — Milestone 7 (task-owner bonus)
 *
 * Shows each teammate, their avatar badge, and what they are currently driving.
 * Supports clicking to filter tasks by driver.
 */
export default function TeammateStrip({
  tasks,
  selectedTeammate,
  onSelectTeammate,
}: TeammateStripProps) {
  // Count active tasks (not done) per teammate
  const counts: Record<string, { total: number; active: number }> = {};
  for (const m of TEAM) {
    counts[m] = { total: 0, active: 0 };
  }
  for (const t of tasks) {
    if (!counts[t.assignee]) {
      counts[t.assignee] = { total: 0, active: 0 };
    }
    counts[t.assignee].total++;
    if (t.status !== 'done') {
      counts[t.assignee].active++;
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Drivers:
        </span>
        {selectedTeammate && (
          <button
            type="button"
            onClick={() => onSelectTeammate(null)}
            className="rounded px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-accent hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Team driver filters">
        {TEAM.map((member) => {
          const theme = getTeammateTheme(member);
          const isSelected = selectedTeammate === member;
          const stat = counts[member] || { total: 0, active: 0 };

          return (
            <button
              key={member}
              type="button"
              aria-pressed={isSelected}
              aria-label={`Filter by driver ${member}. ${stat.active} active tasks.`}
              onClick={() => onSelectTeammate(isSelected ? null : member)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all shadow-sm ${
                isSelected
                  ? `${theme.border} ${theme.bg} ring-2 ring-brand-accent shadow-glow-purple`
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {/* Avatar circle */}
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${theme.bg} ${theme.text} border ${theme.border}`}
                aria-hidden="true"
              >
                {getInitials(member)}
              </span>

              <span className="text-xs font-semibold text-slate-800">
                {member.split(' ')[0]}
              </span>

              <span
                className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold ${
                  stat.active > 0
                    ? `${theme.text} ${theme.bg}`
                    : 'text-slate-500 bg-slate-200/60'
                }`}
                title={`${stat.active} active tasks (${stat.total} total)`}
              >
                {stat.active} active
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
