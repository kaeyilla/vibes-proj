/**
 * Task data model — the single source of truth for PRD §5, §7 and §8.
 *
 * TypeScript crash course for this file:
 *   - `as const` freezes an array/object so TS knows the exact literal values
 *     (e.g. 'todo') instead of widening them to plain `string`.
 *   - `(typeof X)[number]` turns such an array into a union type:
 *       ['a', 'b'] as const  →  'a' | 'b'
 *     so the constants and the types can never drift apart.
 *   - `interface` describes the shape of an object.
 *   - `unknown` is the safe version of `any`: you must check it before using it.
 *   - `value is Task` (a "type guard") tells TS that if the function returns
 *     true, `value` really is a Task from then on.
 */

// ---------------------------------------------------------------------------
// Constants (runtime values) + the types derived from them
// ---------------------------------------------------------------------------

/** The four board columns, in render order (PRD §7). */
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
] as const;

/** 'todo' | 'in-progress' | 'review' | 'done' */
export type TaskStatus = (typeof STAGES)[number]['id'];

export const TASK_TYPES = ['feature', 'bug'] as const;
/** 'feature' | 'bug' */
export type TaskType = (typeof TASK_TYPES)[number];

/** The only valid assignees (PRD §8). */
export const TEAM = [
  'Reuben',
  'Ken',
  'Sam',
  'King',
] as const;
export type Assignee = (typeof TEAM)[number];

/** AI tools a context briefing can come from (M9). */
export const CONTEXT_TOOLS = [
  'Claude',
  'ChatGPT',
  'Cursor',
  'Lovable',
  'Replit',
  'Other',
] as const;
export type ContextTool = (typeof CONTEXT_TOOLS)[number];

/**
 * Type aliases add meaning without adding runtime checks.
 * TS still treats these as `string`; they just document intent.
 */
export type ISODate = string; // 'YYYY-MM-DD'
export type ISOTimestamp = string; // full `new Date().toISOString()`

// ---------------------------------------------------------------------------
// The model
// ---------------------------------------------------------------------------

/** A single vibecoding task (PRD §5 — locked, change only with team agreement). */
export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  assignee: Assignee;
  dueDate: ISODate | null;
  createdDate: ISODate;

  // Added in M9 (context)
  context: string;
  contextTool: ContextTool | null;
  /** Set automatically whenever `context` changes. */
  contextUpdatedAt: ISOTimestamp | null;
}

/**
 * What the "+" modal needs to supply. Only `title` is required; everything
 * else gets a sensible default. The system-managed fields are excluded.
 *
 *   Pick<T, K>    → keep only keys K
 *   Omit<T, K>    → drop keys K
 *   Partial<T>    → make every key optional
 *   A & B         → must satisfy both
 */
export type NewTaskInput = Pick<Task, 'title'> &
  Partial<Omit<Task, 'id' | 'createdDate' | 'contextUpdatedAt'>>;

/** Fields the edit modal is allowed to change. */
export type TaskChanges = Partial<
  Omit<Task, 'id' | 'createdDate' | 'contextUpdatedAt'>
>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Today's date as 'YYYY-MM-DD' in the user's local timezone. */
export function todayISO(): ISODate {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function newId(): string {
  // randomUUID exists on localhost/https; fall back to a timestamp otherwise.
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Build a complete Task from the modal's input. */
export function createTask(input: NewTaskInput): Task {
  const context = input.context ?? '';
  return {
    id: newId(),
    title: input.title.trim(),
    description: input.description ?? '',
    type: input.type ?? 'feature',
    status: input.status ?? 'todo',
    assignee: input.assignee ?? TEAM[0],
    dueDate: input.dueDate ?? null,
    createdDate: todayISO(),
    context,
    contextTool: input.contextTool ?? null,
    contextUpdatedAt: context ? new Date().toISOString() : null,
  };
}

/**
 * Return a NEW task with `changes` applied (never mutate React state).
 * Bumps `contextUpdatedAt` only when the context text actually changed.
 */
export function updateTask(task: Task, changes: TaskChanges): Task {
  const contextChanged =
    changes.context !== undefined && changes.context !== task.context;
  return {
    ...task,
    ...changes,
    contextUpdatedAt: contextChanged
      ? new Date().toISOString()
      : task.contextUpdatedAt,
  };
}

// ---------------------------------------------------------------------------
// Validation — localStorage hands us `unknown`, so check before trusting it
// ---------------------------------------------------------------------------

/** Generic: is `value` one of the strings in `list`? Narrows to that union. */
function isOneOf<T extends string>(
  list: readonly T[],
  value: unknown,
): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

const STATUS_IDS: readonly TaskStatus[] = STAGES.map((s) => s.id);

const isNullableString = (v: unknown): v is string | null =>
  v === null || typeof v === 'string';

/** Strict check: does `value` match the Task shape exactly? */
export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.description === 'string' &&
    isOneOf(TASK_TYPES, t.type) &&
    isOneOf(STATUS_IDS, t.status) &&
    isOneOf(TEAM, t.assignee) &&
    isNullableString(t.dueDate) &&
    typeof t.createdDate === 'string' &&
    typeof t.context === 'string' &&
    (t.contextTool === null || isOneOf(CONTEXT_TOOLS, t.contextTool)) &&
    isNullableString(t.contextUpdatedAt)
  );
}

/**
 * Load tasks saved by an older version of the app. Tasks saved before M9 are
 * missing the context fields, so fill those in before validating. Anything
 * still invalid is dropped instead of crashing the board.
 */
export function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  const parsed = raw
    .map((item: unknown, index: number): Task | null => {
      if (typeof item !== 'object' || item === null) return null;
      const t = item as Record<string, unknown>;

      // Map legacy names or distribute evenly
      let resolvedAssignee: Assignee;
      if (t.assignee === 'Kaenawah Yilla') resolvedAssignee = 'Reuben';
      else if (t.assignee === 'Robert Flores') resolvedAssignee = 'Ken';
      else if (t.assignee === 'Juliette Ortega') resolvedAssignee = 'Sam';
      else if (t.assignee === 'Maguette Seck') resolvedAssignee = 'King';
      else if (isOneOf(TEAM, t.assignee)) resolvedAssignee = t.assignee;
      else resolvedAssignee = TEAM[index % TEAM.length];

      return {
        id: typeof t.id === 'string' && t.id ? t.id : `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: typeof t.title === 'string' && t.title ? t.title : 'Untitled Task',
        description: typeof t.description === 'string' ? t.description : '',
        type: t.type === 'bug' ? 'bug' : 'feature',
        status: isOneOf(STATUS_IDS, t.status) ? t.status : 'todo',
        assignee: resolvedAssignee,
        dueDate: typeof t.dueDate === 'string' && t.dueDate ? t.dueDate : null,
        createdDate: typeof t.createdDate === 'string' && t.createdDate ? t.createdDate : todayISO(),
        context: typeof t.context === 'string' ? t.context : '',
        contextTool: isOneOf(CONTEXT_TOOLS, t.contextTool) ? t.contextTool : null,
        contextUpdatedAt: typeof t.contextUpdatedAt === 'string' ? t.contextUpdatedAt : null,
      };
    })
    .filter((t): t is Task => t !== null);

  // If all or nearly all stored tasks were lumped onto Ken (due to earlier legacy fallback),
  // split them up across all four team members (Reuben, Ken, Sam, King)
  const kenCount = parsed.filter((t) => t.assignee === 'Ken').length;
  if (parsed.length > 1 && (kenCount === parsed.length || (kenCount >= 3 && kenCount >= parsed.length * 0.75))) {
    return parsed.map((t, idx) => ({
      ...t,
      assignee: TEAM[idx % TEAM.length],
    }));
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// Seed data — evenly distributed across team members and columns (M4)
// ---------------------------------------------------------------------------

export const SEED_TASKS: Task[] = [
  createTask({
    title: 'Build the four-column board',
    description: 'Render STAGES as columns and drop each task into its column.',
    status: 'in-progress',
    assignee: 'Reuben',
  }),
  createTask({
    title: 'PR Review: Component Architecture & Types',
    description: 'Verify accessibility, keyboard focus trapping, and clean props contract.',
    status: 'review',
    assignee: 'Ken',
  }),
  createTask({
    title: 'Sprint roadmap & milestone coordination',
    description: 'Align Anchor Board deliverables and monitor team velocity.',
    status: 'todo',
    assignee: 'Sam',
  }),
  createTask({
    title: 'Due date shows wrong day near midnight',
    description: 'Use local dates, not UTC, when formatting dueDate.',
    type: 'bug',
    status: 'review',
    assignee: 'King',
    dueDate: todayISO(),
  }),
  createTask({
    title: 'Feature vs. bug colours & due-date tints',
    description: 'Apply the DESIGN.md tag colours and due-date tints to each card.',
    status: 'done',
    assignee: 'Reuben',
  }),
  createTask({
    title: 'Audit AI prompt context copy payloads',
    description: 'Ensure prompt history and tool source metadata copy cleanly to clipboard.',
    status: 'done',
    assignee: 'Ken',
  }),
  createTask({
    title: 'Presentation & demo slide deck synchronization',
    description: 'Link final presentation slides into the top Anchor Board slot.',
    status: 'in-progress',
    assignee: 'Sam',
  }),
  createTask({
    title: 'Automated test suite & regression coverage',
    description: 'Run edge-case test suites and validate prompt context sync.',
    type: 'bug',
    status: 'todo',
    assignee: 'King',
  }),
];

// ---------------------------------------------------------------------------
// Anchor Board (M11)
// ---------------------------------------------------------------------------

export const ANCHOR_IDS = [
  'presentation',
  'demo',
  'report',
  'documentation',
] as const;
export type AnchorId = (typeof ANCHOR_IDS)[number];

/** One of the four pinned deliverable slots. */
export interface Anchor {
  id: AnchorId;
  label: string;
  url: string | null;
}

export const DEFAULT_ANCHORS: Anchor[] = [
  { id: 'presentation', label: 'Presentation', url: null },
  { id: 'demo', label: 'Demo', url: null },
  { id: 'report', label: 'Report', url: null },
  { id: 'documentation', label: 'Documentation', url: null },
];
