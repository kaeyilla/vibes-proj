/**
 * Context Helper — Milestone 9 (Teammate C: Juliette Ortega)
 *
 * Utilities for curated prompt context management and Markdown serialization.
 * Follows PRD §5 & §9 specifications.
 */

export const AI_TOOLS = [
  'Claude',
  'ChatGPT',
  'Cursor',
  'Lovable',
  'Replit',
  'Other',
] as const;

export type ContextToolName = (typeof AI_TOOLS)[number];

export const CONTEXT_TEMPLATE = `## Context
**Background**

**Constraints**

**Tried so far**

**Pick up**`;

/**
 * Format an ISO timestamp as a relative time hint ("last updated 2 h ago", "just now").
 */
export function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} h ago`;
    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays} d ago`;
  } catch {
    return '';
  }
}

/**
 * Format an ISO timestamp for display in UI.
 */
export function formatContextTimestamp(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export interface PromptContextSerializable {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  assignee?: string;
  dueDate?: string | null;
  context?: string;
  contextTool?: string | null;
  contextUpdatedAt?: string | null;
}

/**
 * Serializes a task and its curated context block into a paste-ready Markdown prompt briefing.
 * Milestone 10 ("Copy Context" hero moment).
 */
export function serializePromptContext(task: PromptContextSerializable): string {
  if (!task) return '';

  const toolName = task.contextTool || 'General AI';
  const updatedRelative = formatRelativeTime(task.contextUpdatedAt);
  const updatedExact = formatContextTimestamp(task.contextUpdatedAt);
  const updatedText = updatedRelative
    ? `${updatedRelative} (${updatedExact})`
    : updatedExact || 'Never';

  const parts = [
    `# Context: ${task.title || 'Untitled Task'}`,
    ``,
    `**Task ID:** ${task.id || 'N/A'}`,
    `**Type:** ${task.type || 'feature'}`,
    `**Status:** ${task.status || 'todo'}`,
    `**Assignee:** ${task.assignee || 'Unassigned'}`,
  ];

  if (task.dueDate) {
    parts.push(`**Due Date:** ${task.dueDate}`);
  }
  if (task.contextTool) {
    parts.push(`**AI Tool:** ${toolName}`);
  }
  if (task.contextUpdatedAt) {
    parts.push(`**Context Updated:** ${updatedText}`);
  }

  parts.push(``);
  parts.push(`## Description`);
  parts.push(task.description ? task.description : 'No description provided.');
  parts.push(``);
  parts.push(`## Context Briefing`);
  parts.push(
    task.context && task.context.trim() ? task.context : CONTEXT_TEMPLATE
  );

  return parts.join('\n');
}
