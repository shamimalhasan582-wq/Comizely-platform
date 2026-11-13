/**
 * Design System Tokens
 * 
 * Centralized theme colors, typography, border-radii, shadows,
 * and layout constants for the Comizely design system.
 */

export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#6355FF',
      hover: '#5243e8',
      light: '#F0F1FF',
      active: '#4824DE',
      accent: '#8075FF',
      accentHover: '#6e62ff',
    },
    background: {
      main: '#F2F2F2',
      surface: '#FFFFFF',
      subtle: '#F8FAFC',
      muted: '#F1F5F9',
    },
    text: {
      primary: '#0F172A', // slate-900
      secondary: '#334155', // slate-700
      muted: '#64748B', // slate-500
      subtle: '#94A3B8', // slate-400
      inverted: '#FFFFFF',
    },
    border: {
      light: '#F1F5F9', // slate-100
      DEFAULT: '#E2E8F0', // slate-200
      strong: '#CBD5E1', // slate-300
    },
    status: {
      pending: {
        bg: '#FEF3C7',
        text: '#D97706',
        border: '#FDE68A',
      },
      followUp: {
        bg: '#F3E8FF',
        text: '#9333EA',
        border: '#E9D5FF',
      },
      approved: {
        bg: '#DCFCE7',
        text: '#16A34A',
        border: '#BBF7D0',
      },
      processing: {
        bg: '#E0F2FE',
        text: '#0284C7',
        border: '#BAE6FD',
      },
      readyToShip: {
        bg: '#EDE9FE',
        text: '#7C3AED',
        border: '#DDD6FE',
      },
      delivered: {
        bg: '#D1FAE5',
        text: '#059669',
        border: '#A7F3D0',
      },
      returned: {
        bg: '#FFE4E6',
        text: '#E11D48',
        border: '#FECDD3',
      },
      cancelled: {
        bg: '#F1F5F9',
        text: '#64748B',
        border: '#E2E8F0',
      },
    },
  },
  borderRadius: {
    badge: '9999px',
    button: '1rem', // 16px / rounded-2xl
    card: '1rem', // 16px
    modal: '1.5rem', // 24px
    content: '2.5rem', // 40px / rounded-tl-[40px]
  },
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    primaryButton: '0 2px 8px 0 rgba(99, 85, 255, 0.25)',
  },
} as const;
