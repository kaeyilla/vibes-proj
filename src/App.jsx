import { useState, useEffect } from 'react';
import TaskModal from './components/TaskModal';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Allowed values for Task.assignee from PRD §8
export const TEAM = [
  'Kaenawah Yilla',
  'Robert Flores',
  'Juliette Ortega',
  'Maguette Seck',
];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  // Task state persisted to localStorage (used by M4 board & M5 modal)
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);

  // M5 crud-modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  function handleSaveTask(taskData) {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === taskData.id);
      if (exists) {
        return prev.map((t) => (t.id === taskData.id ? taskData : t));
      }
      return [taskData, ...prev];
    });
  }

  function handleDeleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handleOpenEdit(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function handleOpenCreate() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-surface-page text-text-primary p-6 font-sans">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Vibecoding Project Tracker
            </h1>
            <span className="rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-xs font-mono font-medium text-brand-accent border border-brand-accent/30">
              v1.0
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            <span className="font-semibold text-text-primary">DIVERSIFIED</span> — The ultimate vibecoding project for max aura
          </p>
        </div>

        {/* Milestone 5: + New Task Button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-new-task"
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            + New Task
          </button>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M4 data-model (Teammate A):
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.
          Pass handleOpenEdit(task) to each card's onClick handler.
      */}
      <main className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border-subtle bg-surface-card/40 text-text-muted">
        <div className="text-center">
          <p className="font-medium text-text-primary">Build the four-column board here · M4</p>
          <p className="text-xs text-text-muted mt-1">Reserved for Teammate A (Kaenawah Yilla)</p>
        </div>
      </main>

      {/* M5 Interactive Task Preview (allows testing Add, Edit, Delete until Teammate A finishes M4 board) */}
      {tasks.length > 0 && (
        <section className="mt-8 rounded-xl border border-border-subtle bg-surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                Stored Tasks ({tasks.length})
              </h2>
              <p className="text-xs text-text-muted">
                Click any card to edit or delete via TaskModal (M5)
              </p>
            </div>
            <span className="text-xs font-mono text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded border border-brand-accent/20">
              localStorage synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleOpenEdit(task)}
                className="group cursor-pointer rounded-lg border border-border-subtle bg-surface-page p-4 hover:border-brand-accent/50 hover:bg-surface-card-hover transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleOpenEdit(task);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      task.type === 'feature'
                        ? 'bg-type-feature/15 text-type-feature border border-type-feature/30'
                        : 'bg-type-bug/15 text-type-bug border border-type-bug/30'
                    }`}
                  >
                    {task.type}
                  </span>
                  <span className="text-xs font-mono text-text-muted capitalize">
                    {task.status}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-text-primary group-hover:text-brand-accent transition-colors">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-text-muted line-clamp-2 mt-1">
                    {task.description}
                  </p>
                )}
                {task.context && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20 w-fit">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{task.contextTool || 'AI'} Context</span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border-subtle">
                  <span>{task.assignee}</span>
                  {task.dueDate && <span className="font-mono">{task.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* M5 Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        teamMembers={TEAM}
      />
    </div>
  );
}

