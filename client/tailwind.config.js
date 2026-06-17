export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        backgroundAlt: '#0F172A',
        surface: '#111827',
        surfaceAlt: '#1E293B',
        shell: 'rgba(8, 17, 32, 0.9)',
        panel: 'rgba(15, 23, 42, 0.72)',
        panelStrong: 'rgba(30, 41, 59, 0.82)',
        card: 'rgba(15, 23, 42, 0.82)',
        primary: '#06B6D4',
        secondary: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          strong: '#F8FAFC',
          base: '#E2E8F0',
          muted: '#CBD5E1',
          dim: '#94A3B8',
        },
        border: {
          subtle: 'rgba(148, 163, 184, 0.10)',
          strong: 'rgba(148, 163, 184, 0.22)',
          active: 'rgba(6, 182, 212, 0.42)',
        },
      },
      boxShadow: {
        glass: '0 24px 60px rgba(2, 6, 23, 0.38)',
        glow: '0 0 0 1px rgba(6, 182, 212, 0.18), 0 18px 45px rgba(6, 182, 212, 0.22)',
        danger: '0 0 0 1px rgba(239, 68, 68, 0.22), 0 18px 45px rgba(239, 68, 68, 0.16)',
        lift: '0 18px 40px rgba(2, 6, 23, 0.34)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'app-shell':
          'radial-gradient(circle at top, rgba(6,182,212,0.10), transparent 28%), linear-gradient(180deg, #020617 0%, #0F172A 100%)',
        'card-glow':
          'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.88) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        command: '0.18em',
      },
    },
  },
  plugins: [],
};
