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
  'Kaenawah Yilla': {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    glow: 'rgba(99,102,241,0.25)',
  },
  'Robert Flores': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'rgba(245,158,11,0.25)',
  },
  'Juliette Ortega': {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'rgba(6,182,212,0.25)',
  },
  'Maguette Seck': {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'rgba(16,185,129,0.25)',
  },
};

export function getTeammateTheme(name: string) {
  return (
    TEAMMATE_THEMES[name] || {
      bg: 'bg-brand-primary/15',
      text: 'text-brand-primary',
      border: 'border-brand-primary/30',
      glow: 'rgba(99,102,241,0.25)',
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
    <div className="mb-6 flex flex-wrap items-center gap-2.5 rounded-xl border border-border-subtle bg-surface-card/60 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 pr-2 border-r border-border-subtle">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Drivers:
        </span>
        {selectedTeammate && (
          <button
            type="button"
            onClick={() => onSelectTeammate(null)}
            className="rounded px-2 py-0.5 font-mono text-[11px] text-brand-accent hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TEAM.map((member) => {
          const theme = getTeammateTheme(member);
          const isSelected = selectedTeammate === member;
          const stat = counts[member] || { total: 0, active: 0 };

          return (
            <button
              key={member}
              type="button"
              onClick={() => onSelectTeammate(isSelected ? null : member)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all ${
                isSelected
                  ? `${theme.border} ${theme.bg} ring-1 ring-brand-accent shadow-sm`
                  : 'border-border-subtle bg-surface-page/60 hover:border-border-hover hover:bg-surface-card-hover'
              }`}
            >
              {/* Avatar circle */}
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}
              >
                {getInitials(member)}
              </span>

              <span className="text-xs font-medium text-text-primary">
                {member.split(' ')[0]}
              </span>

              <span
                className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                  stat.active > 0
                    ? `${theme.text} ${theme.bg}`
                    : 'text-text-muted bg-surface-subtle'
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
