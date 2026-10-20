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
];

/**
 * Format an ISO timestamp for display in UI.
 *
 * @param {string|null} isoString
 * @returns {string}
 */
export function formatContextTimestamp(isoString) {
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

/**
 * Serializes a task and its curated context block into a paste-ready Markdown prompt.
 * Ready for M9 context persistence and M10 "Copy as Prompt Context" hero moment.
 *
 * @param {import('../App').Task} task
 * @returns {string}
 */
export function serializePromptContext(task) {
  if (!task) return '';

  const toolName = task.contextTool || 'AI';
  const updated = formatContextTimestamp(task.contextUpdatedAt);

  return [
    `# Task Context: ${task.title}`,
    ``,
    `- **Type:** ${task.type || 'feature'}`,
    `- **Status:** ${task.status || 'todo'}`,
    `- **Assignee:** ${task.assignee || 'Unassigned'}`,
    task.dueDate ? `- **Due Date:** ${task.dueDate}` : null,
    `- **AI Tool Context:** ${toolName}${updated ? ` (Updated ${updated})` : ''}`,
    ``,
    `## Description`,
    task.description ? task.description : 'No description provided.',
    ``,
    `## Curated Prompt Briefing`,
    task.context ? task.context : 'No prompt context recorded yet.',
    ``,
    `---`,
    `*Generated from Vibecoding Project Tracker (VibeSync)*`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}
