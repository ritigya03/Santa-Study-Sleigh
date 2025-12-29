"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export const POMODORO_TIME = 1 * 60;

interface PomodoroContextType {
  timeLeft: number;
  isRunning: boolean;
  sessionActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  setTimeLeft: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  setSessionActive: (active: boolean) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  // Timer countdown effect - runs globally
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setSessionActive(false);
          return 0; // ✅ FIXED: Stop at 0 instead of auto-reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = useCallback(() => {
    setSessionActive(true);
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(POMODORO_TIME);
  }, []);

  return (
    <PomodoroContext.Provider
      value={{
        timeLeft,
        isRunning,
        sessionActive,
        toggleTimer,
        resetTimer,
        setTimeLeft,
        setIsRunning,
        setSessionActive,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within PomodoroProvider");
  }
  return context;
}