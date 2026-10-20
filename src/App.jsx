import { useState } from 'react';
import AnchorBoard from './components/AnchorBoard';
import VibeMeter from './components/VibeMeter';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import TeammateStrip from './components/TeammateStrip';
import HandoffToast from './components/HandoffToast';
import { useTasks } from './hooks/useTasks';
import { TEAM } from './models/task';

export default function App() {
  // M4 data-model & M5 persistence: typed, validated hook with seed fallback
  const [tasks, setTasks] = useTasks();

  // M5 crud-modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // M7 task-owner state: driver filter & handoff/copy/move toast
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  return (
    <div className="min-h-screen bg-surface-page p-6 text-text-primary font-sans">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-text-primary">
            DIVERSIFIED
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
            </span>
            <span className="rounded border border-border-hover px-1.5 py-0.5 font-mono text-[10px] font-normal text-text-muted">
              v1.1
            </span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            <span className="font-mono text-brand-accent">24045235</span> · The ultimate kanban board for maximum aura
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
      <main>
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
      />

      {/* M7 Handoff & M10 Copy Context Acknowledgment Toast */}
      <HandoffToast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
