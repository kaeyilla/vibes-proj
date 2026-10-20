/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens
        'brand-primary': '#6366F1',
        'brand-accent': '#06B6D4',
        'surface-page': '#0B0F17',
        'surface-card': '#131B2E',
        'surface-card-hover': '#1A243D',
        'surface-subtle': '#1E293B',
        'border-subtle': '#1E293B',
        'border-hover': '#334155',
        'text-primary': '#F8FAFC',
        'text-muted': '#94A3B8',

        // Task type (M6 tag-style)
        'type-feature': '#10B981',
        'type-bug': '#F43F5E',
        feature: '#10B981',
        bug: '#F43F5E',

        // Due-date states (M8 due-tint)
        'due-safe': '#10B981',
        'due-warning': '#F59E0B',
        'due-overdue': '#EF4444',
        'due-neutral': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
