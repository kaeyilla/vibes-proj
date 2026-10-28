import { useState } from 'react';
import AnchorBoard from './components/AnchorBoard';
import VibeMeter from './components/VibeMeter';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import TeammateStrip from './components/TeammateStrip';
import HandoffToast from './components/HandoffToast';
import MockLogin from './components/MockLogin';
import { useTasks } from './hooks/useTasks';
import { TEAM, SEED_TASKS } from './models/task';

export default function App() {
  // Current user / profile switcher state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem('vibecoding_current_user') || null;
    } catch {
      return null;
    }
  });

  // M4 data-model & M5 persistence: typed, validated hook with seed fallback
  const [tasks, setTasks] = useTasks();

  // M5 crud-modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // M7 task-owner state: driver filter & handoff/copy/move toast
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  function handleLogin(userName) {
    setCurrentUser(userName);
    try {
      localStorage.setItem('vibecoding_current_user', userName);
    } catch {
      // ignore
    }
    setToastMessage(`Welcome, ${userName}! Logged in to sprint session.`);
  }

  function handleLogout() {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vibecoding_current_user');
    } catch {
      // ignore
    }
  }

  function handleResetTasks() {
    setTasks(SEED_TASKS);
    setToastMessage('Tasks distributed and rebalanced evenly across the group!');
  }

  /**
   * M7 task-owner: Reassign task to another teammate with visual toast confirmation.
   * Microcopy per DESIGN.md §5: "Task handed off to {name}. Context is synced."
   */
  function handleHandoff(taskId, newAssignee) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: newAssignee } : t))
    );
    setToastMessage(`Task handed off to ${newAssignee}. Context is synced.`);
  }

  /**
   * M12 secret-sauce: HTML5 drag-and-drop task movement between columns
   */
  function handleMoveTask(taskId, targetStatus) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    if (targetStatus === 'done') {
      setToastMessage(`"${task.title}" completed! +500 Aura level up! 🎉`);
    } else {
      const stageLabel =
        targetStatus === 'in-progress'
          ? 'In Progress'
          : targetStatus === 'review'
            ? 'Review'
            : 'To Do';
      setToastMessage(`Moved "${task.title}" to ${stageLabel}.`);
    }
  }

  function handleSaveTask(taskData) {
    const existing = tasks.find((t) => t.id === taskData.id);
    if (existing && existing.assignee !== taskData.assignee) {
      setToastMessage(`Task handed off to ${taskData.assignee}. Context is synced.`);
    }

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

  // Tasks filtered by driver if selected in TeammateStrip
  const displayedTasks = selectedDriver
    ? tasks.filter((t) => t.assignee === selectedDriver)
    : tasks;

  // Frictionless Entry: Display sleek MockLogin landing page when no profile is selected
  if (!currentUser) {
    return <MockLogin onLogin={handleLogin} currentUser={currentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 text-slate-900 font-sans">
      {/* Accessibility Skip-to-Content Link for screen readers & keyboard navigation */}
      <a
        href="#main-board"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-glow-purple focus:ring-2 focus:ring-brand-accent focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Screen reader live announcement region */}
      <div
        id="sr-announcements"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {toastMessage}
      </div>

      <header role="banner" className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            DIVERSIFIED
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-accent" />
            </span>
            <span className="rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-xs font-bold text-brand-primary shadow-sm">
              v1.1
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
            Sprint tracker & assistive workflow intelligence
          </p>
        </div>

        {/* Profile indicator & Actions */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Active Logged-in User Chip & Switch Profile button */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary text-xs font-bold text-white shadow-sm"
              aria-hidden="true"
            >
              {currentUser.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Active Session
              </span>
            </div>
            <button
              id="btn-switch-user"
              type="button"
              onClick={handleLogout}
              title="Switch user profile"
              className="ml-2 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 hover:text-brand-primary hover:border-brand-primary/40 hover:bg-white transition-all active:scale-95"
            >
              Switch Profile
            </button>
          </div>

          {/* Quick Rebalance / Distribute Tasks across group */}
          <button
            id="btn-rebalance-tasks"
            type="button"
            onClick={handleResetTasks}
            title="Distribute sample tasks evenly across Reuben, Ken, Sam, and King"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Rebalance Board</span>
          </button>

          {/* Milestone 5: New Task Button with single plus icon */}
          <button
            id="btn-new-task"
            type="button"
            onClick={handleOpenCreate}
            aria-label="Create new task"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-glow-purple border border-brand-violet/30 hover:bg-brand-primary-hover active:scale-95 transition-all"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Milestone 11: Deliverable Anchor Board (Presentation / Demo / Report / Documentation) */}
      <AnchorBoard />

      {/* Milestone 12: Vibe Meter / Sprint Aura Heatmap */}
      <VibeMeter tasks={tasks} />

      {/* M7 Milestone: Driver Strip showing who is driving what */}
      <TeammateStrip
        tasks={tasks}
        selectedTeammate={selectedDriver}
        onSelectTeammate={setSelectedDriver}
      />

      {/* M4 Kanban Board: 4 columns with cards, wired to M5 modal, M7 handoff, M8 due-tint, M10 copy, M12 drag & drop */}
      <main id="main-board" role="main" aria-label="Kanban task board">
        <Board
          tasks={displayedTasks}
          onSelectTask={handleOpenEdit}
          onHandoff={handleHandoff}
          onCopySuccess={(msg) => setToastMessage(msg)}
          onMoveTask={handleMoveTask}
        />
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
        currentUser={currentUser}
      />

      {/* M7 Handoff & M10 Copy Context Acknowledgment Toast */}
      <HandoffToast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
