module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        ink: "#0A0A0B",
        surface: "#141416",
        "surface-elevated": "#1C1C1F",
        
        // Borders
        border: "#2A2A2E",
        "border-subtle": "#1F1F23",
        
        // Text hierarchy
        "text-primary": "#FAFAFA",
        "text-secondary": "#A1A1A6",
        "text-muted": "#636366",
        
        // Brand accent - Gold
        accent: "#F5A623",
        "accent-hover": "#FFBA42",
        "accent-muted": "rgba(245, 166, 35, 0.15)",
        
        // Semantic colors
        success: "#34C759",
        "success-muted": "rgba(52, 199, 89, 0.15)",
        danger: "#FF3B30",
        "danger-muted": "rgba(255, 59, 48, 0.15)",
        warning: "#FF9500",
        
        // Legacy support (gradual migration)
        panel: "#141416",
        card: "#1C1C1F",
        muted: "#636366",
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
        'glow': '0 0 20px rgba(245, 166, 35, 0.15)',
        'glow-sm': '0 0 10px rgba(245, 166, 35, 0.1)',
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
