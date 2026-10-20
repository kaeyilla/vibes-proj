import { useState, useEffect } from 'react';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import { useTasks } from './hooks/useTasks';

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

import { TEAM } from './models/task';

export default function App() {
  // M4 data-model & M5 persistence: typed, validated hook with seed fallback
  const [tasks, setTasks] = useTasks();

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
    <div className="min-h-screen bg-surface-page p-6 text-text-primary font-sans">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-text-primary">
            VibeSync
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
            </span>
            <span className="rounded border border-border-hover px-1.5 py-0.5 font-mono text-[10px] font-normal text-text-muted">
              v1.0
            </span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            <span className="font-mono text-brand-accent">DIVERSIFIED</span> · The ultimate vibecoding project for max aura
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

      {/* M4 Kanban Board: 4 columns with cards, wired to M5 modal */}
      <main>
        <Board tasks={tasks} onSelectTask={handleOpenEdit} />
      </main>

      {/* M5 Task Modal (Add / Edit / Delete) */}
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
