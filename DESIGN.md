# Vibecoding Project Tracker — Design

**Status:** Completed (`design-done` milestone ready) · Design system and tokens aligned with `tailwind.config.js`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

A high-velocity, ambient dark-mode cockpit designed for flow state—combining the surgical precision of Linear with the kinetic responsiveness of Raycast.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- **Linear**: Minimalist dark cards, keyboard-driven feel, subtle 1px border hierarchy and high-contrast typography.
- **Raycast**: Ambient dark obsidian background, vibrant neon status indicators, and clean monospace metadata pills.
- **Vercel Dashboard**: Structured metric surfaces, crisp geometric layouts, and fluid interaction feedback.

Anti-references — what we are explicitly **not** trying to look like:

- Cluttered enterprise Jira with endless nested menus and sluggish gray forms.
- Generic default Tailwind light-mode templates with standard corporate blue (`#3B82F6`).

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#6366F1` | Header accents, "+" button, focus rings, primary actions |
| `brand-accent` | `#06B6D4` | Cyan glow highlights, hover states, prompt badges, links |
| `surface-page` | `#0B0F17` | Deep obsidian page background |
| `surface-card` | `#131B2E` | Elevated dark card background |
| `text-primary` | `#F8FAFC` | Main headings and body text (Slate 50) |
| `text-muted` | `#94A3B8` | Captions, dates, column counts, prompt previews (Slate 400) |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#10B981` | Cards tagged `feature` (emerald accent stripe + pill icon) |
| `type-bug` | `#F43F5E` | Cards tagged `bug` (crimson/rose accent stripe + pill icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#10B981` | More than 2 days out (calm emerald border/dot) |
| `due-warning` | `#F59E0B` | Less than 24 hours (amber attention border/dot) |
| `due-overdue` | `#EF4444` | Past due (urgent coral border/dot) |
| `due-neutral` | `#64748B` | Done (completed status overrides due date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `Inter, sans-serif` | Tight geometric tracking, punchy bold weights for instant scanability. |
| Body | `Inter, sans-serif` | Clean, open counterforms optimized for UI reading on dark displays. |
| Monospace (tags, badges, code) | `"JetBrains Mono", monospace` | Crisp character distinction for prompt tokens, assignees, and dates. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** Elevated dark surface (`#131B2E`) with a 1px border (`#1E293B`), subtle hover lift with cyan accent glow, and no heavy drop shadows.
- **Buttons:** Solid indigo or cyan pill fills, 150ms hover scale transition, generous touch targets, and rounded-lg borders.
- **Modal:** Centered, max-w-lg, dark glassmorphism backdrop (`rgba(11, 15, 23, 0.75)`) with backdrop blur, sharp input borders, and keyboard autofocus.
- **Empty states:** 2px dashed border (`#1E293B`), subtle icon, and encouraging microcopy that prompts adding the first task.
- **Drag affordance (if used):** Smooth card transitions with quick status drop targets and intuitive status dropdown controls.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `+ New Task` |
| Empty column placeholder | `All clear here — ready for the next vibe.` |
| Toast after "Copy as Prompt Context" | `Prompt context copied. Ready to paste into AI.` |
| Confirm-delete message | `Delete this task permanently? You can't undo this action.` |
| Handoff toast (M7 `task-owner`) | `Task handed off to {name}. Context is synced.` |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `VibeSync` (Vibecoding Project Tracker)
- **Wordmark style:** Bold `VibeSync` in Inter semibold with an electric cyan live-sync pulse dot and small monospace `v1.0` badge.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
