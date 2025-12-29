import { useState, useEffect, useCallback } from "react";

export const POMODORO_TIME = 25 * 60;

export function usePomodoro(onTaskComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  // Sync timer state to localStorage for cross-page persistence
  useEffect(() => {
    const timerState = {
      timeLeft,
      isRunning,
      sessionActive,
      timestamp: Date.now(),
    };
    localStorage.setItem("pomodoroTimer", JSON.stringify(timerState));
  }, [timeLeft, isRunning, sessionActive]);

  // Restore timer state from localStorage when component mounts
  useEffect(() => {
    const savedState = localStorage.getItem("pomodoroTimer");
    if (savedState) {
      try {
        const { timeLeft: saved, isRunning: wasRunning, timestamp } = JSON.parse(savedState);
        const elapsed = Math.floor((Date.now() - timestamp) / 1000);
        const newTime = Math.max(0, saved - elapsed);
        
        setTimeLeft(newTime);
        setIsRunning(false);
      } catch (e) {
        console.error("Error restoring timer state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTaskComplete?.();
          setIsRunning(false);
          setSessionActive(false);
          return POMODORO_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTaskComplete]);

  const toggleTimer = useCallback(() => {
    setSessionActive(true);
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(POMODORO_TIME);
  }, []);

  return {
    timeLeft,
    isRunning,
    sessionActive,
    toggleTimer,
    resetTimer,
    setTimeLeft,
    setIsRunning,
    setSessionActive,
  };
}