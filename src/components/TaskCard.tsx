import React, { useState } from 'react';
import { TEAM, type Assignee, type Task } from '../models/task';
import { getTeammateTheme, getInitials } from './TeammateStrip';
import { getDueTintClasses } from '../utils/dueTint';
import { serializePromptContext } from '../utils/contextHelper';
import { playPickupSound } from '../utils/soundEffects';

interface TaskCardProps {
  task: Task;
  onSelect?: (task: Task) => void;
  onHandoff?: (taskId: string, newAssignee: Assignee) => void;
  onCopySuccess?: (message: string) => void;
}

/** '2026-10-20' → '20 Oct'. Parsed as a LOCAL date to avoid UTC off-by-one. */
function formatDue(iso?: string | null): string {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0])) return iso;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TaskCard({
  task,
  onSelect,
  onHandoff,
  onCopySuccess,
}: TaskCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const assigneeName = task?.assignee || 'Unassigned';
  const theme = getTeammateTheme(assigneeName);
  const isBug = task?.type === 'bug';

  // Milestone 8: due-tint time-based state and styling
  const dueTint = getDueTintClasses(task.dueDate, task.status);

  function handleHandoffChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    const newAssignee = e.target.value as Assignee;
    if (newAssignee && newAssignee !== task.assignee && onHandoff) {
      onHandoff(task.id, newAssignee);
    }
  }

  // Milestone 10: Copy Context button handler
  async function handleCopyContext(e: React.MouseEvent) {
    e.stopPropagation();
    const markdown = serializePromptContext(task);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopySuccess) {
        onCopySuccess('Prompt context copied. Ready to paste into AI.');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }

  // Accessibility: Text-To-Speech "Read Task Aloud"
  function handleSpeak(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const text = `${task.type || 'feature'} task: ${task.title}. Assigned to ${assigneeName}. Status: ${task.status}. ${task.dueDate ? `Due date: ${task.dueDate}` : ''}. ${task.description ? `Description: ${task.description}` : 'No description'}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    playPickupSound();
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const target = e.target as HTMLElement;
    // Don't trigger if user is interacting with interactive inner controls
    if (['BUTTON', 'SELECT', 'INPUT', 'A'].includes(target.tagName)) {
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onSelect) onSelect(task);
    }
  }

  const accessibleLabel = `Task: ${task.title}. Type: ${task.type || 'feature'}. Status: ${task.status}. Assignee: ${assigneeName}. ${task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}. Press Enter or Space to open task details.`;

  return (
    <article
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      aria-label={accessibleLabel}
      onKeyDown={handleKeyDown}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onSelect ? () => onSelect(task) : undefined}
      className={`task-card group relative rounded-xl border p-3.5 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-md bg-white ${
        dueTint.borderClass
      } ${
        isBug
          ? 'border-l-4 border-l-red-500'
          : 'border-l-4 border-l-emerald-500'
      } ${
        isDragging
          ? 'opacity-40 scale-95 ring-2 ring-brand-accent shadow-2xl'
          : ''
      }`}
    >
      {/* Header: Title + M6 tag-style visual distinction */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          {/* Subtle drag handle indicator */}
          <span
            className="mt-0.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"
            title="Drag task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
          </span>
          <h3 className="text-sm font-semibold leading-snug text-slate-900 group-hover:text-brand-primary transition-colors truncate">
            {task.title || 'Untitled Task'}
          </h3>
        </div>

        {/* Milestone 6: Feature vs Bug badge with icon and distinct color */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
            isBug
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isBug ? (
            <svg
              className="h-3 w-3 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg
              className="h-3 w-3 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          <span>{task.type || 'feature'}</span>
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {task.description}
        </p>
      )}

      {/* Due date badge & Quick Action Buttons */}
      <div className="mt-2.5 flex items-center justify-between gap-1.5 flex-wrap">
        {task.dueDate ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-mono border ${dueTint.badgeClass}`}
            title={`Due date: ${task.dueDate} (${dueTint.label})`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${dueTint.dotClass}`}
              aria-hidden="true"
            />
            <span>{formatDue(task.dueDate)}</span>
            <span className="opacity-80">· {dueTint.label}</span>
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 italic">No deadline</span>
        )}

        <div className="flex items-center gap-1.5">
          {/* TTS Read Aloud Quick Button */}
          <button
            type="button"
            onClick={handleSpeak}
            aria-label={isSpeaking ? 'Stop reading task aloud' : `Read task ${task.title} aloud`}
            title={isSpeaking ? 'Stop reading' : 'Read task aloud'}
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-mono font-medium transition ${
              isSpeaking
                ? 'border-brand-primary bg-brand-primary text-white animate-pulse shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {isSpeaking ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" aria-hidden="true" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Read</span>
              </>
            )}
          </button>

          {/* Milestone 10: "Copy Context" button on card */}
          <button
            type="button"
            onClick={handleCopyContext}
            aria-label="Copy prompt context briefing for AI"
            title="Copy prompt context briefing for AI"
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-mono font-medium transition ${
              copied
                ? 'border-brand-accent bg-brand-accent text-white shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer: Prominent Assignee Badge + "Hand off to..." Dropdown (M7 task-owner) */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2.5 font-mono text-[11px] text-slate-600">
        {/* Prominent Assignee Avatar Badge */}
        <div
          className="flex items-center gap-1.5"
          title={`Assigned to ${assigneeName}`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold border ${theme.bg} ${theme.text} ${theme.border}`}
          >
            {getInitials(assigneeName)}
          </span>
          <span className="font-sans text-xs font-semibold text-slate-800">
            {assigneeName.split(' ')[0]}
          </span>
        </div>

        {/* Hand off to dropdown */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <label htmlFor={`handoff-${task.id}`} className="sr-only">
            Hand off task
          </label>
          <select
            id={`handoff-${task.id}`}
            value={task.assignee}
            onChange={handleHandoffChange}
            aria-label="Hand off to..."
            className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer"
          >
            <option disabled value="">
              Hand off to...
            </option>
            {TEAM.map((member) => (
              <option key={member} value={member}>
                → {member.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </article>
  );
}
