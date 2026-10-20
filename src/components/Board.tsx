import { STAGES, type Task, type TaskStatus } from '../models/task';
import TaskCard from './TaskCard';

interface BoardProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  onHandoff?: (taskId: string, newAssignee: import('../models/task').Assignee) => void;
  onCopySuccess?: (message: string) => void;
}

/**
 * `Record<K, V>` = an object with exactly the keys K, each holding a V.
 * Because K is TaskStatus, TS errors if you forget a column (try deleting one).
 */
const STAGE_DOT: Record<TaskStatus, string> = {
  todo: 'bg-text-muted',
  'in-progress': 'bg-brand-accent',
  review: 'bg-brand-primary',
  done: 'bg-due-safe',
};

function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = {
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  };
  if (!Array.isArray(tasks)) return groups;

  for (const task of tasks) {
    if (!task) continue;
    const s = task.status;
    if (s && s in groups) {
      groups[s].push(task);
    } else {
      groups.todo.push(task);
    }
  }
  return groups;
}

export default function Board({
  tasks,
  onSelectTask,
  onHandoff,
  onCopySuccess,
}: BoardProps) {
  const byStatus = groupByStatus(tasks);

  return (
    <div className="space-y-3">
      {/* Milestone 8: Board Task Urgency Legend (per slide 8) */}
      <div className="flex flex-wrap items-center justify-end gap-3 px-1 text-[11px] font-mono text-text-muted">
        <span className="font-sans text-xs font-medium text-text-primary">
          Task Urgency:
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-due-safe" />
          <span>More than 2 Days</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-due-warning" />
          <span>Less than 24h</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-due-overdue animate-pulse" />
          <span>Past Due</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-due-neutral" />
          <span>Complete</span>
        </span>
      </div>

      <section aria-label="Kanban board" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const columnTasks = byStatus[stage.id];
          return (
            <div
              key={stage.id}
              id={`column-${stage.id}`}
              className="flex min-h-[24rem] flex-col rounded-xl border border-border-subtle bg-surface-card/40 p-3"
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-primary">
                  <span className={`h-2 w-2 rounded-full ${STAGE_DOT[stage.id]}`} />
                  {stage.label}
                </h2>
                <span className="rounded-full bg-surface-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
                  {columnTasks.length}
                </span>
              </header>

              {columnTasks.length === 0 ? (
                <p className="grid flex-1 place-items-center rounded-lg border-2 border-dashed border-border-subtle p-4 text-center text-xs text-text-muted">
                  All clear here — ready for the next vibe.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={onSelectTask}
                      onHandoff={onHandoff}
                      onCopySuccess={onCopySuccess}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
