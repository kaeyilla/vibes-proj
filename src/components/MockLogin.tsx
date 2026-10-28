import React, { useState } from 'react';

export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  tagline: string;
  initials: string;
  roleBadgeClass: string;
  avatarGradient: string;
  accentBorderHover: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

export interface MockLoginProps {
  /**
   * Callback invoked when a user profile is clicked.
   * Passes the selected user's name to the parent component.
   */
  onLogin: (userName: string) => void;
  /**
   * Optional currently active user name.
   */
  currentUser?: string | null;
}

// Sample team members per prompt requirements:
// Reuben (Developer), Ken (Code Reviewer), Sam (Project Manager), and King (Quality Tester)
export const TEAM_PROFILES: TeamMemberProfile[] = [
  {
    id: 'reuben',
    name: 'Reuben',
    role: 'Developer',
    tagline: 'Component architecture, feature development, & modern frontend logic.',
    initials: 'RE',
    roleBadgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    avatarGradient: 'from-purple-600 to-indigo-600',
    accentBorderHover: 'hover:border-purple-400 hover:ring-purple-200',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'ken',
    name: 'Ken',
    role: 'Code Reviewer',
    tagline: 'Code audits, pull request reviews, & software design verification.',
    initials: 'KE',
    roleBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    avatarGradient: 'from-amber-500 to-orange-600',
    accentBorderHover: 'hover:border-amber-400 hover:ring-amber-200',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'sam',
    name: 'Sam',
    role: 'Project Manager',
    tagline: 'Sprint coordination, milestone roadmaps, & deliverable alignment.',
    initials: 'SA',
    roleBadgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    avatarGradient: 'from-sky-500 to-blue-600',
    accentBorderHover: 'hover:border-sky-400 hover:ring-sky-200',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'king',
    name: 'King',
    role: 'Quality Tester',
    tagline: 'Test suites, edge-case validation, bug detection, & QA automation.',
    initials: 'KI',
    roleBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    avatarGradient: 'from-emerald-500 to-teal-600',
    accentBorderHover: 'hover:border-emerald-400 hover:ring-emerald-200',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

/**
 * MockLogin Component
 *
 * A modern, sleek landing page component for frictionless profile switching.
 * Fitts's Law-compliant large targets with fluid hover elevation and responsive 2x2 grid.
 */
export default function MockLogin({ onLogin, currentUser }: MockLoginProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleProfileClick = (name: string) => {
    if (isTransitioning) return;

    setSelectedUser(name);
    setIsTransitioning(true);

    // Brief tactile feedback duration before triggering simulated onLogin callback
    setTimeout(() => {
      onLogin(name);
    }, 420);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-brand-primary selection:text-white overflow-hidden">
      {/* Background Decorative Accents */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/35 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center z-10">
        {/* Workspace Brand Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="tracking-wide uppercase text-[11px] font-bold text-slate-700">
            DIVERSIFIED SPRINT TRACKER
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Profile Switcher</span>
        </div>

        {/* Primary Heading per requirement */}
        <h1
          id="login-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 text-center mb-3"
        >
          Which user is logging in?
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-500 text-center max-w-lg mb-8 sm:mb-10 font-normal">
          Select your team member profile below to seamlessly enter the sprint board. Instant access, zero passwords required.
        </p>

        {/* 2x2 Grid on desktop & tablet, stacked single column on mobile */}
        <div
          role="region"
          aria-labelledby="login-heading"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full"
        >
          {TEAM_PROFILES.map((member) => {
            const isSelected = selectedUser === member.name;
            const isCurrentlyActive = currentUser === member.name;
            const Icon = member.icon;

            return (
              <button
                key={member.id}
                id={`profile-card-${member.id}`}
                type="button"
                onClick={() => handleProfileClick(member.name)}
                disabled={isTransitioning}
                aria-pressed={isSelected}
                aria-label={`Log in as ${member.name}, ${member.role}`}
                className={`group relative flex flex-col justify-between w-full p-6 sm:p-7 min-h-[190px] rounded-2xl text-left bg-white border transition-all duration-300 ease-out transform cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary ${
                  isSelected
                    ? 'ring-4 ring-brand-primary border-brand-primary bg-purple-50/50 shadow-glow-purple scale-[1.03] z-20'
                    : `border-slate-200 shadow-sm hover:scale-105 hover:shadow-xl hover:shadow-slate-200/70 ${member.accentBorderHover}`
                }`}
              >
                {/* Active Session Badge (if previously active) */}
                {isCurrentlyActive && !isSelected && (
                  <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Last active
                  </span>
                )}

                {/* Top Row: Avatar & Role Pill */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {/* Large Avatar Target with Initials */}
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${member.avatarGradient} text-white font-bold text-lg shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <span>{member.initials}</span>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
                        title="Online"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      {/* Name */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-primary transition-colors">
                          {member.name}
                        </span>
                      </div>

                      {/* Role Badge */}
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 font-mono text-xs font-semibold ${member.roleBadgeClass}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{member.role}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual feedback indicator on select */}
                  {isSelected && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white shadow-sm animate-bounce">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Middle: Tagline */}
                <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {member.tagline}
                </p>

                {/* Bottom Row: Call to Action Feedback */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span
                    className={`transition-colors ${
                      isSelected
                        ? 'font-bold text-brand-primary'
                        : 'text-slate-400 group-hover:text-brand-primary'
                    }`}
                  >
                    {isSelected
                      ? `Entering as ${member.name}...`
                      : 'Click to select profile'}
                  </span>

                  <span
                    className={`inline-flex items-center transition-transform duration-200 ${
                      isSelected
                        ? 'translate-x-1 text-brand-primary'
                        : 'text-slate-400 group-hover:translate-x-1.5 group-hover:text-brand-primary'
                    }`}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Minimalist Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 font-mono">
            Frictionless profile switcher • Tab and Enter supported for rapid keyboard selection
          </p>
        </div>
      </div>
    </div>
  );
}
