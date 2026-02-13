export type ThemeKey = 'spring' | 'summer' | 'autumn' | 'winter';

export type PaletteConfig = {
  fromColor: string;
  toColor: string;
  navBg: string;
  navBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  surfaceBg: string;
  surfaceBorder: string;
  chipBg: string;
  chipText: string;
  buttonBg: string;
  buttonOutline: string;
  cardBorder: string;
  cardBorderStatic: string;
  badgeBg: string;
  decorativeColors: readonly string[];
};

export const themeConfig = {
  spring: {
    name: '',
    emoji: '🌸',
    palettes: {
      light: {
        fromColor: '#fdf2f8',
        toColor: '#fff1f2',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-pink-500 hover:bg-pink-600',
        buttonOutline: 'border-pink-500 text-pink-600 hover:bg-pink-50',
        cardBorder: 'border-pink-200 hover:border-pink-400',
        cardBorderStatic: 'border-pink-200',
        badgeBg: 'bg-pink-100 border-pink-200 text-pink-700 hover:bg-pink-200',
        decorativeColors: ['bg-pink-300', 'bg-rose-300', 'bg-pink-200'],
      },
      dark: {
        fromColor: '#2a121a',
        toColor: '#120a0f',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-pink-600 hover:bg-pink-500',
        buttonOutline: 'border-pink-300 text-pink-200 hover:bg-pink-900/30',
        cardBorder: 'border-pink-900 hover:border-pink-700',
        cardBorderStatic: 'border-pink-900',
        badgeBg: 'bg-pink-900/50 border-pink-800 text-pink-100 hover:bg-pink-800/60',
        decorativeColors: ['bg-pink-800/40', 'bg-rose-800/40', 'bg-pink-700/40'],
      },
    },
  },
  summer: {
    name: '',
    emoji: '☀️',
    palettes: {
      light: {
        fromColor: '#eff6ff',
        toColor: '#ecfeff',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-blue-500 hover:bg-blue-600',
        buttonOutline: 'border-blue-500 text-blue-600 hover:bg-blue-50',
        cardBorder: 'border-blue-200 hover:border-blue-400',
        cardBorderStatic: 'border-blue-200',
        badgeBg: 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200',
        decorativeColors: ['bg-blue-300', 'bg-cyan-300', 'bg-sky-300'],
      },
      dark: {
        fromColor: '#0b1220',
        toColor: '#07131d',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-blue-600 hover:bg-blue-500',
        buttonOutline: 'border-blue-300 text-blue-200 hover:bg-blue-900/30',
        cardBorder: 'border-blue-900 hover:border-blue-700',
        cardBorderStatic: 'border-blue-900',
        badgeBg: 'bg-blue-900/50 border-blue-800 text-blue-100 hover:bg-blue-800/60',
        decorativeColors: ['bg-blue-800/40', 'bg-cyan-800/40', 'bg-sky-800/40'],
      },
    },
  },
  autumn: {
    name: '',
    emoji: '🍂',
    palettes: {
      light: {
        fromColor: '#fff7ed',
        toColor: '#fffbeb',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-orange-500 hover:bg-orange-600',
        buttonOutline: 'border-orange-500 text-orange-600 hover:bg-orange-50',
        cardBorder: 'border-orange-200 hover:border-orange-400',
        cardBorderStatic: 'border-orange-200',
        badgeBg: 'bg-orange-100 border-orange-200 text-orange-700 hover:bg-orange-200',
        decorativeColors: ['bg-orange-300', 'bg-amber-300', 'bg-yellow-300'],
      },
      dark: {
        fromColor: '#1b1207',
        toColor: '#0f0a05',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-orange-600 hover:bg-orange-500',
        buttonOutline: 'border-orange-300 text-orange-200 hover:bg-orange-900/30',
        cardBorder: 'border-orange-900 hover:border-orange-700',
        cardBorderStatic: 'border-orange-900',
        badgeBg: 'bg-orange-900/50 border-orange-800 text-orange-100 hover:bg-orange-800/60',
        decorativeColors: ['bg-orange-800/40', 'bg-amber-800/40', 'bg-yellow-800/40'],
      },
    },
  },
  winter: {
    name: '',
    emoji: '❄️',
    palettes: {
      light: {
        fromColor: '#f8fafc',
        toColor: '#eff6ff',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-slate-600 hover:bg-slate-700',
        buttonOutline: 'border-slate-600 text-slate-600 hover:bg-slate-50',
        cardBorder: 'border-slate-200 hover:border-slate-400',
        cardBorderStatic: 'border-slate-200',
        badgeBg: 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200',
        decorativeColors: ['bg-slate-300', 'bg-blue-300', 'bg-slate-200'],
      },
      dark: {
        fromColor: '#0b111a',
        toColor: '#0a1621',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-slate-600 hover:bg-slate-500',
        buttonOutline: 'border-slate-300 text-slate-200 hover:bg-slate-900/30',
        cardBorder: 'border-slate-800 hover:border-slate-600',
        cardBorderStatic: 'border-slate-800',
        badgeBg: 'bg-slate-900/50 border-slate-800 text-slate-100 hover:bg-slate-800/60',
        decorativeColors: ['bg-slate-700/40', 'bg-blue-800/40', 'bg-slate-800/40'],
      },
    },
  },
} as const;

export const getInitialThemeKey = (): ThemeKey => {
  const now = new Date();
  const jst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  const month = jst.getMonth() + 1;

  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  if (month >= 10 && month <= 12) return 'autumn';
  return 'winter';
};
