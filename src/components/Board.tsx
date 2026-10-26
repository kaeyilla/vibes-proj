import React, { useState } from 'react';
import { STAGES, type Task, type TaskStatus } from '../models/task';
import TaskCard from './TaskCard';
import { playDropSound, playDoneLevelUpSound } from '../utils/soundEffects';

interface BoardProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  onHandoff?: (taskId: string, newAssignee: import('../models/task').Assignee) => void;
  onCopySuccess?: (message: string) => void;
  onMoveTask?: (taskId: string, targetStatus: TaskStatus) => void;
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
  onMoveTask,
}: BoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const byStatus = groupByStatus(tasks);

  function handleDragOver(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if actually leaving the column container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverColumn(null);
  }

  function handleDrop(e: React.DragEvent, targetStatus: TaskStatus) {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    if (targetStatus === 'done') {
      playDoneLevelUpSound();
    } else {
      playDropSound();
    }

    if (onMoveTask) {
      onMoveTask(taskId, targetStatus);
    }
  }

  return (
    <div className="space-y-3">
      {/* Milestone 8: Board Task Urgency Legend (per slide 8) */}
      <div className="flex flex-wrap items-center justify-end gap-3 px-1 text-[11px] font-mono text-slate-500">
        <span className="font-sans text-xs font-bold text-slate-700">
          Task Urgency:
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>More than 2 Days</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Less than 24h</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>Past Due</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-slate-400" />
          <span>Complete</span>
        </span>
      </div>

      <section aria-label="Kanban board" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const columnTasks = byStatus[stage.id];
          const isOver = dragOverColumn === stage.id;

          return (
            <div
              key={stage.id}
              id={`column-${stage.id}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`flex min-h-[26rem] flex-col rounded-xl border p-3 transition-all duration-200 ${
                isOver
                  ? 'border-brand-primary bg-purple-50 ring-2 ring-brand-primary/40 shadow-glow-purple -translate-y-0.5'
                  : 'border-slate-200 bg-slate-100/75 shadow-sm'
              }`}
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${STAGE_DOT[stage.id]}`} />
                  {stage.label}
                </h2>
                <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 shadow-sm">
                  {columnTasks.length}
                </span>
              </header>

              {/* Drop Target Indicator when dragging over */}
              {isOver && (
                <div className="mb-2 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-brand-primary bg-brand-primary/10 py-2 text-center text-xs font-mono font-semibold text-brand-primary animate-pulse">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>Drop to move to {stage.label}</span>
                </div>
              )}

              {columnTasks.length === 0 ? (
                <p className="grid flex-1 place-items-center rounded-lg border-2 border-dashed border-slate-300/80 bg-white/40 p-4 text-center text-xs font-medium text-slate-400">
                  All clear here — ready for the next vibe.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
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
