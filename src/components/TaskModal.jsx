import { useState, useEffect, useRef } from 'react';
import { STAGES, TEAM } from '../App';

/**
 * TaskModal — Milestone 5 (Teammate C: Juliette Ortega)
 *
 * Modal component for adding, editing, and deleting tasks.
 * Styled according to DESIGN.md §4:
 *   - Dark glassmorphism backdrop with blur
 *   - Elevated surface-card (#131B2E)
 *   - Sharp border-subtle (#1E293B)
 *   - Focus rings with brand-primary
 *   - Confirm delete with DESIGN.md §5 microcopy
 */
export default function TaskModal({
  isOpen,
  task = null,
  onSave,
  onDelete,
  onClose,
  teamMembers = TEAM,
}) {
  const isEditMode = Boolean(task && task.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('feature');
  const [status, setStatus] = useState('todo');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const titleInputRef = useRef(null);

  // Sync state when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setType(task.type || 'feature');
        setStatus(task.status || 'todo');
        setAssignee(task.assignee || (teamMembers.length > 0 ? teamMembers[0] : ''));
        setDueDate(task.dueDate || '');
      } else {
        // Reset defaults for new task
        setTitle('');
        setDescription('');
        setType('feature');
        setStatus('todo');
        setAssignee(teamMembers.length > 0 ? teamMembers[0] : '');
        setDueDate('');
      }
      setShowDeleteConfirm(false);
      setValidationError('');

      // Autofocus title
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, task, teamMembers]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('Title is required.');
      titleInputRef.current?.focus();
      return;
    }

    const payload = {
      id: isEditMode ? task.id : `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: description.trim(),
      type,
      status,
      assignee: assignee || (teamMembers[0] || 'Unassigned'),
      dueDate: dueDate || null,
      createdDate: isEditMode && task?.createdDate ? task.createdDate : new Date().toISOString().slice(0, 10),
      // Preserve existing context fields if present (M9 extension hook)
      ...(task?.context !== undefined && { context: task.context }),
      ...(task?.contextTool !== undefined && { contextTool: task.contextTool }),
      ...(task?.contextUpdatedAt !== undefined && { contextUpdatedAt: task.contextUpdatedAt }),
    };

    onSave(payload);
    onClose();
  }

  function handleConfirmDelete() {
    if (isEditMode && task?.id && onDelete) {
      onDelete(task.id);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-page/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-subtle bg-surface-card p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                type === 'feature' ? 'bg-type-feature' : 'bg-type-bug'
              }`}
            />
            <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
              {isEditMode ? 'Edit Task' : 'New Task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Delete Confirmation Banner (DESIGN.md §5 microcopy) */}
        {showDeleteConfirm && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200">
            <p className="font-medium text-red-300">
              Delete this task permanently? You can&apos;t undo this action.
            </p>
            <div className="mt-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400">
              {validationError}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="e.g. Scaffold Vite board layout"
              className="w-full rounded-lg border border-border-subtle bg-surface-page px-3.5 py-2.5 text-sm text-text-primary placeholder:text-slate-600 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-1.5">
              Description
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be accomplished and any key context..."
              className="w-full rounded-lg border border-border-subtle bg-surface-page px-3.5 py-2 text-sm text-text-primary placeholder:text-slate-600 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
            />
          </div>

          {/* Type & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div>
              <label htmlFor="task-type" className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-1.5">
                Type
              </label>
              <select
                id="task-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-page px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-page px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div>
              <label htmlFor="task-assignee" className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-1.5">
                Assignee
              </label>
              <select
                id="task-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-page px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="task-due-date" className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-1.5">
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-page px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
            <div>
              {isEditMode && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  Delete Task
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-medium text-text-muted hover:bg-slate-700 hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 active:scale-95 transition-all"
              >
                {isEditMode ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
