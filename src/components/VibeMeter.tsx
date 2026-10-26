import { useState, useEffect } from 'react';
import type { Task } from '../models/task';
import { getDueState } from '../utils/dueTint';
import { isSoundMuted, setSoundMuted } from '../utils/soundEffects';

interface VibeMeterProps {
  tasks: Task[];
}

export default function VibeMeter({ tasks }: VibeMeterProps) {
  const [soundEnabled, setSoundEnabled] = useState(!isSoundMuted());

  useEffect(() => {
    setSoundEnabled(!isSoundMuted());
  }, []);

  function handleToggleSound() {
    const nextState = !soundEnabled;
    setSoundMuted(!nextState);
    setSoundEnabled(nextState);
  }

  const totalTasks = tasks.length;
  const features = tasks.filter((t) => t.type === 'feature').length;
  const bugs = tasks.filter((t) => t.type === 'bug').length;

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;

  const overdueCount = tasks.filter(
    (t) => getDueState(t.dueDate, t.status) === 'due-overdue'
  ).length;

  // 1. Feature vs Bug ratio (0 to 100)
  const featureRatio =
    totalTasks > 0 ? Math.round((features / totalTasks) * 100) : 100;

  // 2. Velocity / Completion ratio (0 to 100)
  const completionRatio =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  // 3. Deadline turnaround / Health ratio (penalized heavily by overdue tasks)
  const overduePenalty = totalTasks > 0 ? Math.min(40, (overdueCount / totalTasks) * 80) : 0;
  const deadlineHealth = Math.max(0, Math.round(100 - overduePenalty));

  // Overall Vibe Score (0 to 100)
  const rawScore =
    totalTasks === 0
      ? 100
      : Math.round(completionRatio * 0.45 + featureRatio * 0.3 + deadlineHealth * 0.25);
  const vibeScore = Math.min(100, Math.max(10, rawScore));

  // Aura tier labels and colors
  let auraLabel = 'BUILDING MOMENTUM 🚀';
  let auraColor = 'from-brand-accent to-brand-primary';
  let auraBadgeClass = 'border-orange-300 bg-orange-50 text-orange-700 shadow-sm';

  if (vibeScore >= 90) {
    auraLabel = 'GOD-TIER AURA 🌟';
    auraColor = 'from-emerald-400 via-brand-accent to-brand-primary';
    auraBadgeClass = 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm';
  } else if (vibeScore >= 75) {
    auraLabel = 'MAXIMUM VIBES 🔥';
    auraColor = 'from-cyan-500 via-brand-primary to-orange-500';
    auraBadgeClass = 'border-cyan-300 bg-cyan-50 text-cyan-800 shadow-sm';
  } else if (vibeScore >= 60) {
    auraLabel = 'FLOW STATE ⚡';
    auraColor = 'from-brand-primary to-cyan-500';
    auraBadgeClass = 'border-purple-300 bg-purple-50 text-purple-800 shadow-sm';
  } else if (vibeScore < 45) {
    auraLabel = 'BUG SQUASH MODE 🛠️';
    auraColor = 'from-rose-500 to-amber-500';
    auraBadgeClass = 'border-rose-300 bg-rose-50 text-rose-800 shadow-sm';
  }

  return (
    <section
      aria-label="Sprint Aura and Vibe Meter"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Title + Aura Tier Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-brand-accent">
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sprint Aura & Vibe Meter
              </h2>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold border ${auraBadgeClass}`}>
                {auraLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Real-time velocity & code health heatmap
            </p>
          </div>
        </div>

        {/* Right side: Score count + Audio FX toggle */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable drag & drop sound FX'}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono font-medium transition active:scale-95 shadow-sm ${
              soundEnabled
                ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white'
                : 'border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900'
            }`}
          >
            {soundEnabled ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Sound FX On</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span>Muted</span>
              </>
            )}
          </button>

          {/* Vibe Score Display */}
          <div className="flex items-baseline gap-1 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="font-mono text-lg font-bold text-brand-accent">
              {vibeScore}%
            </span>
            <span className="font-mono text-[10px] text-slate-500 font-semibold">Vibe</span>
          </div>
        </div>
      </div>

      {/* Dynamic Animated Aura Heatmap Progress Bar */}
      <div className="relative mb-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${auraColor} transition-all duration-500 shadow-sm`}
          style={{ width: `${vibeScore}%` }}
        />
      </div>

      {/* Breakdown Heatmap Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
        {/* Features vs Bugs */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 shadow-sm">
          <span className="text-slate-500 font-medium">Feature Ratio:</span>
          <span className="font-semibold text-emerald-700">
            {featureRatio}% ({features}F / {bugs}B)
          </span>
        </div>

        {/* Turnaround / Velocity */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 shadow-sm">
          <span className="text-slate-500 font-medium">Turnaround:</span>
          <span className="font-semibold text-brand-accent">
            {completionRatio}% ({doneCount}/{totalTasks} Done)
          </span>
        </div>

        {/* In-Flight Work */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 shadow-sm">
          <span className="text-slate-500 font-medium">In Flight:</span>
          <span className="font-semibold text-brand-primary">
            {inProgressCount + reviewCount} active ({todoCount} queued)
          </span>
        </div>

        {/* Deadline Health */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 shadow-sm">
          <span className="text-slate-500 font-medium">Health:</span>
          <span
            className={`font-semibold ${
              overdueCount > 0 ? 'text-red-600 animate-pulse' : 'text-emerald-700'
            }`}
          >
            {overdueCount > 0 ? `${overdueCount} Overdue!` : '100% On Track'}
          </span>
        </div>
      </div>
    </section>
  );
}
