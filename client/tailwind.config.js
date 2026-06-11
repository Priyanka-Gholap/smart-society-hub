export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        surface: '#111827',
        card: 'rgba(255,255,255,0.08)',
        primary: '#06B6D4',
        secondary: '#3B82F6',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        brand: {
          primary: '#06B6D4',
          secondary: '#3B82F6',
        },
      },
      boxShadow: {
        glow: '0 20px 80px rgba(6, 182, 212, 0.18)',
        soft: '0 24px 80px rgba(15, 23, 42, 0.28)',
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(6,182,212,0.18), transparent 28%)',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
