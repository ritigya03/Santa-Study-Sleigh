import React from "react";

interface PomodoroTimerProps {
  duration?: number; // seconds
}

export default function PomodoroTimer({
  duration = 25 * 60,
}: PomodoroTimerProps) {
  // Placeholder - real implementation will track state and fire events
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl font-semibold">{`${minutes}:${String(
        seconds
      ).padStart(2, "0")}`}</div>
      <div className="text-sm text-gray-500">Pomodoro</div>
    </div>
  );
}
