# Santa Study Sleigh

A festive Pomodoro app to make study sessions feel like a holiday adventure.

## Project structure

```
src/
│
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme, music provider)
│   ├── globals.css             # Tailwind + global styles
│
│   ├── page.tsx                # Landing page (intro / start button)
│
│   ├── dashboard/
│   │   └── page.tsx            # Tasks + Start Pomodoro
│
│   ├── study/
│   │   ├── theme-select/
│   │   │   └── page.tsx        # Choose study environment (3 themes)
│   │   │
│   │   ├── session/
│   │   │   └── page.tsx        # Pomodoro running (sleigh, timer, bg)
│   │   │
│   │   └── complete/
│   │       └── page.tsx        # Session end (gift wrap, ornament)
│
│   ├── celebration/
│   │   └── page.tsx            # Final tree + badges + praise letter
│
│   └── api/                    # (optional, later)
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│
│   ├── timer/
│   │   ├── PomodoroTimer.tsx
│   │   └── SleighPath.tsx
│
│   ├── tasks/
│   │   └── TaskList.tsx
│
│   ├── tree/
│   │   ├── ChristmasTree3D.tsx
│   │   └── Ornament.tsx
│
│   ├── themes/
│   │   ├── SnowTheme.tsx
│   │   ├── CafeTheme.tsx
│   │   └── NightTheme.tsx
│
│   ├── badges/
│   │   └── BadgeCard.tsx
│
│   └── audio/
│       ├── MusicToggle.tsx
│       └── BellSound.tsx
│
├── lib/
│   ├── constants.ts            # Pomodoro count, theme names, badge rules
│   ├── utils.ts
│
├── context/
│   ├── StudyContext.tsx        # sessions, tasks, themes, streaks
│   └── ThemeContext.tsx        # selected study environment
│
├── public/
│   ├── audio/
│   ├── images/
│   └── models/                 # 3D assets (tree, sleigh)
```

## Quick start

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`

---

All components are initial placeholders — next steps: implement timer logic, 3D tree, audio, and polish UI.
