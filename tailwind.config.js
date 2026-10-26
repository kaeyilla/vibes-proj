/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens inspired by GitLab
        'brand-primary': '#7B58CF', // GitLab Signature Purple
        'brand-primary-hover': '#6E49CB',
        'brand-accent': '#FC6D26',  // GitLab Tanuki Orange
        'brand-accent-hover': '#E24329',
        'brand-violet': '#7B58CF',
        'brand-tanuki': '#FC6D26',

        // Surfaces: Reversed Clean Bright White Palette
        'surface-page': '#F8FAFC',       // Clean bright canvas
        'surface-card': '#FFFFFF',       // Pure white cards
        'surface-card-hover': '#F1F5F9', // Soft hover card highlight
        'surface-subtle': '#F1F5F9',     // Clean secondary light background
        'border-subtle': '#E2E8F0',      // Subtle clean card borders
        'border-hover': '#CBD5E1',       // Highlighting border
        'text-primary': '#0F172A',       // Deep readable charcoal/slate
        'text-muted': '#64748B',         // Accessible high-contrast muted text

        // Task type (M6 tag-style)
        'type-feature': '#059669',
        'type-bug': '#DC2626',
        feature: '#059669',
        bug: '#DC2626',

        // Due-date states (M8 due-tint)
        'due-safe': '#059669',
        'due-warning': '#D97706',
        'due-overdue': '#DC2626',
        'due-neutral': '#64748B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 4px 14px 0 rgba(123, 88, 207, 0.22)',
        'glow-orange': '0 4px 14px 0 rgba(252, 109, 38, 0.22)',
        'glow-subtle': '0 2px 10px 0 rgba(123, 88, 207, 0.12)',
        'card-elevated': '0 1px 3px 0 rgba(16, 24, 40, 0.08), 0 1px 2px -1px rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [],
};
