/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"PP Editorial New"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Geist"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        void: 'var(--void)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        ink: {
          primary: 'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
        },
        signal: {
          DEFAULT: 'var(--signal)',
          dim: 'var(--signal-dim)',
          glow: 'var(--signal-glow)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dim: 'var(--accent-dim)',
        },
        danger: '#f87171',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
