import type { Task } from '../models/task';

/** Props are just an interface. `?` means optional. */
interface TaskCardProps {
  task: Task;
  /** M5 crud-modal: pass this to open the edit modal when a card is clicked. */
  onSelect?: (task: Task) => void;
}

/** 'Kaenawah Yilla' → 'KY' */
function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** '2026-10-20' → '20 Oct'. Parsed as a LOCAL date to avoid UTC off-by-one. */
function formatDue(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TaskCard({ task, onSelect }: TaskCardProps) {
  return (
    <article
      onClick={onSelect ? () => onSelect(task) : undefined}
      className={`group rounded-lg border border-border-subtle bg-surface-card p-3 transition duration-150 hover:-translate-y-0.5 hover:border-brand-accent/40 hover:bg-surface-card-hover hover:shadow-[0_0_18px_-6px_rgba(6,182,212,0.45)] ${
        onSelect ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug text-text-primary">
          {task.title}
        </h3>
        {/* TODO M6 tag-style: colour this pill (type-feature / type-bug) + add an accent stripe. */}
        <span className="shrink-0 rounded border border-border-hover px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-muted">
          {task.type}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
          {task.description}
        </p>
      )}

      <footer className="mt-3 flex items-center justify-between font-mono text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5" title={task.assignee}>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-primary/20 text-[9px] font-medium text-brand-primary">
            {initials(task.assignee)}
          </span>
          {task.assignee.split(' ')[0]}
        </span>

        {/* TODO M8 due-tint: colour by due state (due-safe / due-warning / due-overdue / due-neutral). */}
        {task.dueDate ? (
          <time dateTime={task.dueDate}>Due {formatDue(task.dueDate)}</time>
        ) : (
          <span className="opacity-60">No due date</span>
        )}
      </footer>
    </article>
  );
}
