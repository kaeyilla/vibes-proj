# Vibecoding Project Tracker — Design

**Status:** Completed (`design-done` milestone ready) · Design system and tokens aligned with `tailwind.config.js` and current application implementation.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here are visible on every screen across the project.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

A high-productivity, crisp, high-contrast light-mode workspace inspired by GitLab's signature identity and modern developer cockpit aesthetics. Clean, focused white surfaces paired with vibrant purple and tanuki orange accents provide surgical focus, excellent readability, and high accessibility.

Two or three references that capture the vibe:

- **GitLab Next**: Signature deep purple (`#7B58CF`) and tanuki orange (`#FC6D26`) brand accents, sharp card hierarchy, high-contrast readable states, and developer-first information density.
- **Linear / Raycast**: Surgical typography, fluid micro-interactions, responsive hover transitions, accessible focus states, and clean monospace metadata pills.
- **Vercel / GitHub**: Pure white card surfaces (`#FFFFFF`) against soft slate page canvas (`#F8FAFC`), crisp 1px borders, and tactile elevation shadows.

Anti-references — what we are explicitly **not** trying to look like:

- Cluttered enterprise Jira with endless nested menus and sluggish gray forms.
- Generic default Tailwind light-mode templates with standard corporate blue (`#3B82F6`).
- Murky low-contrast dark themes where text is difficult to read in bright daylight.

---

## 2. Color palette

These are the active color tokens defined in `tailwind.config.js` and referenced across all components.

### Brand Tokens

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#7B58CF` | Primary actions ("+ New Task"), primary badges, focus outlines, header highlights |
| `brand-primary-hover` | `#6E49CB` | Hover states for primary buttons and action controls |
| `brand-accent` | `#FC6D26` | Tanuki orange accent, live pulse dot, sprint score highlights, active toggles |
| `brand-accent-hover` | `#E24329` | Hover states for accent controls and sound toggle |
| `surface-page` | `#F8FAFC` | Clean bright canvas background |
| `surface-card` | `#FFFFFF` | Pure white elevated cards, modal panels, and surface containers |
| `surface-card-hover` | `#F1F5F9` | Subtle hover card background highlight |
| `surface-subtle` | `#F1F5F9` | Secondary light backgrounds, chip containers, tag pills |
| `border-subtle` | `#E2E8F0` | Clean border dividers, card boundaries, and separator lines |
| `border-hover` | `#CBD5E1` | Highlighting border on hover states |
| `text-primary` | `#0F172A` | High-contrast charcoal headings and body text (Slate 900) |
| `text-muted` | `#64748B` | Captions, secondary labels, column counts, dates (Slate 500) |

### Task Type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` / `feature` | `#059669` | Cards tagged `feature` (emerald accent border/badge + tag pill) |
| `type-bug` / `bug` | `#DC2626` | Cards tagged `bug` (ruby red accent border/badge + tag pill) |

### Due-Date States (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#059669` | More than 2 days out (emerald border, dot, and badge) |
| `due-warning` | `#D97706` | Less than 24 hours (amber attention border, dot, and badge) |
| `due-overdue` | `#DC2626` | Past due (urgent red border, dot, badge, and pulse) |
| `due-neutral` | `#64748B` | Completed or no deadline (slate border, dot, and badge) |

### Custom Shadows

- `shadow-glow-purple`: `0 4px 14px 0 rgba(123, 88, 207, 0.22)`
- `shadow-glow-orange`: `0 4px 14px 0 rgba(252, 109, 38, 0.22)`
- `shadow-glow-subtle`: `0 2px 10px 0 rgba(123, 88, 207, 0.12)`
- `shadow-card-elevated`: `0 1px 3px 0 rgba(16, 24, 40, 0.08), 0 1px 2px -1px rgba(16, 24, 40, 0.05)`

---

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Primary Sans | `"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif` | Modern geometric humanist sans with high legibility and refined character terminals. |
| Monospace (tags, badges, code) | `"JetBrains Mono", monospace` | Crisp character distinction for prompt tokens, assignees, dates, and metric chips. |

Suggested sizes:

- Page title: 24 px / black (`font-black tracking-tight`)
- Section header: 14 px / bold uppercase (`text-xs sm:text-sm font-bold uppercase tracking-wider`)
- Card title: 14 px / bold (`text-sm font-bold`)
- Body: 14 px / regular
- Caption / metadata: 11-12 px / medium font-mono (`text-xs` / `text-[11px]`)

---

## 4. Component principles

One short sentence per element. These set the tone across the application:

- **Cards:** Crisp pure white surfaces (`#FFFFFF`) with 1px slate borders (`#E2E8F0`), elevated shadow on hover, left-edge accent indicator for task type, and draggable affordance.
- **Buttons:** Solid purple (`#7B58CF`) or subtle slate pill fills, smooth 150ms hover scale transition, keyboard focus rings, and active press scaling.
- **Modal:** Centered, max-w-xl, accessible dialog with high-contrast backdrop blur, clean slate input borders, keyboard focus rings, and autofocus.
- **Focus Rings:** Accessibility-first 3px solid `#7B58CF` outline with `outline-offset: 2px` and `box-shadow: 0 0 10px rgba(123, 88, 207, 0.35)`.
- **Empty States:** 2px dashed border (`border-slate-200`), clean icon, and encouraging microcopy for dropping or creating tasks.
- **Drag Affordance (Secret Sauce):** HTML5 drag-and-drop between columns with smooth hover highlighting and optional Web Audio synthetic sound FX.
- **Sprint Aura & Vibe Meter:** Real-time velocity heatmap with animated gradient progress bar (`from-cyan-500 via-brand-primary to-orange-500`), aura tiers, and sound FX toggle.
- **Deliverable Anchor Board:** Collapsible quick-reference bar tracking presentation, demo, report, and documentation deliverables with direct anchor links.

---

## 5. Voice / microcopy

Microcopy capturing the clean, productive tone of the application:

| Where | Text |
|---|---|
| Header tagline | `Sprint tracker & assistive workflow intelligence` |
| "+" button label | `+ New Task` |
| Empty column placeholder | `All clear here — ready for the next vibe.` |
| Toast after "Copy as Prompt Context" | `Prompt context copied to clipboard! Paste into your AI chat.` |
| Task completed celebration | `"{title}" completed! +500 Aura level up! 🎉` |
| Confirm-delete message | `Delete this task permanently? You can't undo this action.` |
| Handoff toast (M7 `task-owner`) | `Task "{title}" reassigned to {owner}.` |

---

## 6. Logo / wordmark

- **Product name:** `DIVERSIFIED` (Sprint tracker & assistive workflow intelligence)
- **Wordmark style:** Bold `DIVERSIFIED` in Plus Jakarta Sans black weight with an animated pinging tanuki orange live-sync pulse dot and a `v1.1` purple monospace badge.

---

## 7. Scope & Extensions

- **Single Theme:** GitLab-inspired high-contrast clean light theme applied consistently across all components.
- **Accessibility:** High-contrast text compliance, distinct focus-visible rings (`#7B58CF`), ARIA landmarks, screen-reader live announcement region, and reduced-motion support.
- **M12 Secret Sauce:** Seamless HTML5 drag-and-drop task movement paired with Web Audio synthetic sound effects and dynamic Sprint Aura heatmap velocity score.

---

*DESIGN.md version: 1.1 · Updated to match active codebase*
