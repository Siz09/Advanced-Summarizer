// Theme configuration with comprehensive design tokens
export const themes = {
  light: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
      },
      text: {
        primary: '#111827',
        secondary: '#374151',
        tertiary: '#6b7280',
        inverse: '#ffffff',
      },
      border: {
        primary: '#e5e7eb',
        secondary: '#d1d5db',
        focus: '#3b82f6',
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    }
  },
  dark: {
    colors: {
      primary: {
        50: '#1e3a8a',
        100: '#1e40af',
        200: '#1d4ed8',
        300: '#2563eb',
        400: '#3b82f6',
        500: '#60a5fa',
        600: '#93c5fd',
        700: '#bfdbfe',
        800: '#dbeafe',
        900: '#eff6ff',
      },
      secondary: {
        50: '#581c87',
        100: '#6b21a8',
        200: '#7c3aed',
        300: '#9333ea',
        400: '#a855f7',
        500: '#c084fc',
        600: '#d8b4fe',
        700: '#e9d5ff',
        800: '#f3e8ff',
        900: '#faf5ff',
      },
      gray: {
        50: '#111827',
        100: '#1f2937',
        200: '#374151',
        300: '#4b5563',
        400: '#6b7280',
        500: '#9ca3af',
        600: '#d1d5db',
        700: '#e5e7eb',
        800: '#f3f4f6',
        900: '#f9fafb',
      },
      success: {
        50: '#064e3b',
        100: '#065f46',
        200: '#047857',
        300: '#059669',
        400: '#10b981',
        500: '#34d399',
        600: '#6ee7b7',
        700: '#a7f3d0',
        800: '#d1fae5',
        900: '#ecfdf5',
      },
      warning: {
        50: '#78350f',
        100: '#92400e',
        200: '#b45309',
        300: '#d97706',
        400: '#f59e0b',
        500: '#fbbf24',
        600: '#fcd34d',
        700: '#fde68a',
        800: '#fef3c7',
        900: '#fffbeb',
      },
      error: {
        50: '#7f1d1d',
        100: '#991b1b',
        200: '#b91c1c',
        300: '#dc2626',
        400: '#ef4444',
        500: '#f87171',
        600: '#fca5a5',
        700: '#fecaca',
        800: '#fee2e2',
        900: '#fef2f2',
      },
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#e2e8f0',
        tertiary: '#cbd5e1',
        inverse: '#0f172a',
      },
      border: {
        primary: '#334155',
        secondary: '#475569',
        focus: '#60a5fa',
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
    }
  }
};

export const animations = {
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  spring: {
    gentle: { type: 'spring', stiffness: 120, damping: 14 },
    bouncy: { type: 'spring', stiffness: 400, damping: 17 },
    snappy: { type: 'spring', stiffness: 500, damping: 30 },
  },
  easing: {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
  }
};