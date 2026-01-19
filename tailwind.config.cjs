module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core backgrounds - using CSS variables
        ink: "var(--bg-primary)",
        surface: "var(--bg-surface)",
        "surface-elevated": "var(--bg-elevated)",
        "bg-secondary": "var(--bg-secondary)",
        
        // Borders
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        
        // Text hierarchy
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        
        // Brand accent
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-muted": "var(--accent-muted)",
        
        // Semantic colors
        success: "var(--success)",
        "success-muted": "var(--success-muted)",
        danger: "var(--danger)",
        "danger-muted": "var(--danger-muted)",
        warning: "var(--warning)",
        "warning-muted": "var(--warning-muted)",
        
        // Legacy support
        panel: "var(--bg-surface)",
        card: "var(--bg-elevated)",
        muted: "var(--text-muted)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)',
        'glow-sm': 'var(--shadow-glow-sm)',
        'soft': 'var(--shadow-md)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
