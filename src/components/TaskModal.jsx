import { useState, useEffect, useRef } from 'react';
import { STAGES, TEAM } from '../models/task';
import {
  AI_TOOLS,
  CONTEXT_TEMPLATE,
  formatContextTimestamp,
  formatRelativeTime,
  serializePromptContext,
} from '../utils/contextHelper';

function MarkdownPreview({ content }) {
  if (!content || !content.trim()) {
    return (
      <p className="text-xs italic text-text-muted">
        No context provided yet. Write something in the editor to see formatting.
      </p>
    );
  }

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 font-sans text-xs leading-relaxed text-text-primary">
      {lines.map((line, idx) => {
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="mt-2 text-xs font-semibold text-text-primary">
              {line.slice(4)}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="mt-2 text-sm font-semibold text-brand-accent">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={idx} className="mt-2 text-base font-bold text-text-primary">
              {line.slice(2)}
            </h2>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={idx} className="font-semibold text-text-primary">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={idx} className="ml-4 list-disc text-text-muted">
              {line.slice(2)}
            </li>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }
        return (
          <p key={idx} className="text-text-muted">
            {line}
          </p>
        );
      })}
    </div>
  );
}

/**
 * TaskModal — Milestone 5 (CRUD), Milestone 9 (Context Field) & Milestone 10 (Copy Context)
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

  // Milestone 9: Prompt Context state
  const [context, setContext] = useState('');
  const [contextTool, setContextTool] = useState(AI_TOOLS[0]);
  const [contextUpdatedAt, setContextUpdatedAt] = useState(null);
  const [isContextDirty, setIsContextDirty] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  // Milestone 10: Copy Context state
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const titleInputRef = useRef(null);
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Sync state when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;

      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setType(task.type || 'feature');
        setStatus(task.status || 'todo');
        setAssignee(task.assignee || (teamMembers.length > 0 ? teamMembers[0] : ''));
        setDueDate(task.dueDate || '');
        // M9 context fields
        setContext(task.context || '');
        setContextTool(task.contextTool || AI_TOOLS[0]);
        setContextUpdatedAt(task.contextUpdatedAt || null);
        setIsContextDirty(false);
      } else {
        // Reset defaults for new task with M9 placeholder template
        setTitle('');
        setDescription('');
        setType('feature');
        setStatus('todo');
        setAssignee(teamMembers.length > 0 ? teamMembers[0] : '');
        setDueDate('');
        // M9 placeholder template pre-fill
        setContext(CONTEXT_TEMPLATE);
        setContextTool(AI_TOOLS[0]);
        setContextUpdatedAt(null);
        setIsContextDirty(false);
      }
      setActiveTab('write');
      setCopiedSuccess(false);
      setShowDeleteConfirm(false);
      setValidationError('');
      setIsSpeaking(false);

      // Autofocus title for fast keyboard entry
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      previouslyFocusedElement.current?.focus?.();
    }
  }, [isOpen, task, teamMembers]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Keyboard accessibility: Escape to close modal & Focus trap for Tab / Shift+Tab
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusable = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusableArray = Array.from(focusable).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusableArray.length === 0) return;

        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Accessibility: Text-to-Speech Web Speech API
  function speakTask() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const taskDetails = {
      type: type || 'General',
      title: title || 'Untitled task',
      assignee: assignee || 'Unassigned',
      status: status || 'To Do',
      dueDate: dueDate || 'None',
      description: description || 'No description provided.',
      context: context ? `Prompt context: ${context}` : '',
    };

    const text = `${taskDetails.type} task: ${taskDetails.title}. Assigned to ${taskDetails.assignee}. Status: ${taskDetails.status}. ${taskDetails.dueDate !== 'None' ? `Due date: ${taskDetails.dueDate}.` : ''} Description: ${taskDetails.description}. ${taskDetails.context}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function handleCloseModal() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onClose();
  }

  if (!isOpen) return null;

  function handleContextChange(e) {
    setContext(e.target.value);
    setIsContextDirty(true);
  }

  // Milestone 10: Copy Context briefing inside modal
  async function handleModalCopyContext() {
    const fullBriefing = serializePromptContext({
      id: isEditMode ? task.id : 'NEW-TASK',
      title,
      description,
      type,
      status,
      assignee,
      dueDate,
      context,
      contextTool,
      contextUpdatedAt,
    });

    try {
      await navigator.clipboard.writeText(fullBriefing);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('Title is required.');
      titleInputRef.current?.focus();
      return;
    }

    // Determine if context was modified
    const trimmedContext = context.trim();
    const isContextChanged =
      isContextDirty ||
      trimmedContext !== (task?.context || '').trim() ||
      contextTool !== (task?.contextTool || AI_TOOLS[0]);

    let finalTimestamp = task?.contextUpdatedAt || null;
    if (trimmedContext) {
      finalTimestamp = isContextChanged
        ? new Date().toISOString()
        : task?.contextUpdatedAt || new Date().toISOString();
    } else {
      finalTimestamp = null;
    }

    const payload = {
      id: isEditMode
        ? task.id
        : `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: description.trim(),
      type,
      status,
      assignee: assignee || (teamMembers[0] || 'Unassigned'),
      dueDate: dueDate || null,
      createdDate:
        isEditMode && task?.createdDate
          ? task.createdDate
          : new Date().toISOString().slice(0, 10),
      // M9 context fields
      context: trimmedContext,
      contextTool: trimmedContext ? contextTool : null,
      contextUpdatedAt: finalTimestamp,
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onSave(payload);
    onClose();
  }

  function handleConfirmDelete() {
    if (isEditMode && task?.id && onDelete) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      onDelete(task.id);
      onClose();
    }
  }

  const relativeUpdated = formatRelativeTime(contextUpdatedAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseModal();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="task-modal-instructions"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
      >
        <span id="task-modal-instructions" className="sr-only">
          Press Tab to navigate through fields, Escape to cancel and close.
        </span>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`inline-block w-3 h-3 rounded-full shrink-0 ${
                type === 'feature' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              aria-hidden="true"
            />
            <h2 id="modal-title" className="text-lg font-bold text-slate-900 truncate">
              {isEditMode ? `${task.id}: ${task.title}` : 'New Task'}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Accessibility: Text-to-Speech "Read Task Aloud" Button */}
            <button
              type="button"
              onClick={speakTask}
              aria-label={isSpeaking ? 'Stop reading task aloud' : 'Read task details aloud'}
              title={isSpeaking ? 'Stop speech' : 'Read task aloud (Web Speech API)'}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 shadow-sm ${
                isSpeaking
                  ? 'border-brand-primary bg-brand-primary text-white shadow-glow-purple animate-pulse'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {isSpeaking ? (
                <>
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span>Read Aloud</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close modal (Escape)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Banner (DESIGN.md §5 microcopy) */}
        {showDeleteConfirm && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold text-red-800">
              Delete this task permanently? You can&apos;t undo this action.
            </p>
            <div className="mt-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors bg-white shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-2.5 text-xs font-semibold text-red-700">
              {validationError}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Title <span className="text-red-500">*</span>
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              id="task-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be accomplished and any key context..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
            />
          </div>

          {/* Type & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Type with M6 visual distinction */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType('feature')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                    type === 'feature'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Feature
                </button>
                <button
                  type="button"
                  onClick={() => setType('bug')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                    type === 'bug'
                      ? 'border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Bug
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
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
              <label htmlFor="task-assignee" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Assignee
              </label>
              <select
                id="task-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
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
              <label htmlFor="task-due-date" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Milestone 9: Curated Prompt Context Field + Milestone 10: Copy Context */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="task-context" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Context
                </label>
                {/* Write / Preview Tab Toggles (M9 stretch) */}
                <div className="flex items-center rounded-md border border-slate-300 bg-white p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-2 py-0.5 rounded transition ${
                      activeTab === 'write'
                        ? 'bg-orange-100 text-brand-accent font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-2 py-0.5 rounded transition ${
                      activeTab === 'preview'
                        ? 'bg-orange-100 text-brand-accent font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Milestone 10: Copy Context button in modal */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  id="btn-copy-context-modal"
                  onClick={handleModalCopyContext}
                  className="inline-flex items-center gap-1.5 rounded-md border border-orange-300 bg-orange-50 px-2.5 py-1 text-xs font-mono font-semibold text-orange-700 hover:bg-orange-600 hover:text-white transition active:scale-95 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Context
                </button>

                {/* Copied to clipboard toast feedback (M10 stretch) */}
                {copiedSuccess && (
                  <span className="absolute -bottom-7 right-0 rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-white shadow-lg animate-fade-in z-10 whitespace-nowrap">
                    Copied to clipboard!
                  </span>
                )}
              </div>
            </div>

            {/* Textarea or Preview pane */}
            {activeTab === 'write' ? (
              <textarea
                id="task-context"
                rows={5}
                value={context}
                onChange={handleContextChange}
                placeholder="Curated Markdown briefing for any AI tool..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent resize-none leading-relaxed"
              />
            ) : (
              <div className="min-h-[7.5rem] rounded-lg border border-slate-300 bg-white p-3 max-h-48 overflow-y-auto">
                <MarkdownPreview content={context} />
              </div>
            )}

            {/* Last updated timestamp hint (Milestone 9) */}
            {contextUpdatedAt ? (
              <div className="text-[11px] font-mono text-slate-500">
                last updated {relativeUpdated ? `${relativeUpdated} ` : ''}
                <span className="opacity-80 font-medium">(contextUpdatedAt: {contextUpdatedAt})</span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-400">
                Not yet updated (will save timestamp automatically on edit)
              </div>
            )}

            {/* Optional AI Tool Dropdown (Milestone 9) */}
            <div className="pt-1">
              <label htmlFor="task-context-tool" className="block text-xs font-semibold text-slate-600 mb-1">
                Optional AI Context Tool
              </label>
              <select
                id="task-context-tool"
                value={contextTool}
                onChange={(e) => {
                  setContextTool(e.target.value);
                  setIsContextDirty(true);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono cursor-pointer"
              >
                {AI_TOOLS.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              {isEditMode && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                >
                  Delete Task
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-glow-purple border border-brand-violet/30 hover:bg-brand-primary-hover active:scale-95 transition-all"
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
