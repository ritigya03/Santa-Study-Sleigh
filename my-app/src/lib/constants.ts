export const POMODORO_MINUTES = 25;
export const SHORT_BREAK_MINUTES = 5;
export const LONG_BREAK_MINUTES = 15;

export const THEMES = ['snow', 'cafe', 'night'] as const;
export type ThemeName = typeof THEMES[number];
