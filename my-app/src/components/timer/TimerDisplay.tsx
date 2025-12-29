import { Play, Pause, RotateCcw } from "lucide-react";
import Button from "../../components/ui/Button";
import { cn, formatTime } from "../../lib/utils";

interface TimerDisplayProps {
  timeLeft: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  currentTaskText?: string;
  variant?: "full" | "compact" | "minimal";
  showLabel?: boolean;
}

export function TimerDisplay({
  timeLeft,
  isRunning,
  onToggle,
  onReset,
  currentTaskText = "No Task",
  variant = "full",
  showLabel = true,
}: TimerDisplayProps) {
  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
        <span className="text-sm font-bold text-white">
          {formatTime(timeLeft)}
        </span>
        {isRunning && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="text-center">
          {showLabel && (
            <span className="text-[10px] font-black text-yellow-500 tracking-[0.3em] uppercase italic">
              Timer
            </span>
          )}
          <div className="text-4xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] italic mt-2">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onToggle}
            className={cn(
              "flex-1 h-12 rounded-xl text-sm font-black italic transition-all duration-300",
              isRunning
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            )}
          >
            {isRunning ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isRunning ? "PAUSE" : "START"}
          </Button>
          <Button
            onClick={onReset}
            variant="ghost"
            className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 text-white font-bold italic text-sm"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            RESET
          </Button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-2xl h-fit">
      <div className="text-center space-y-2">
        {showLabel && (
          <span className="text-[10px] font-black text-yellow-500 tracking-[0.3em] uppercase italic">
            Current Task
          </span>
        )}
        <h3 className="text-xl font-bold text-white truncate px-4">
          {currentTaskText}
        </h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-[5.5rem] font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] leading-none italic">
          {formatTime(timeLeft)}
        </div>

        <div className="w-full mt-8 flex flex-col gap-3">
          <Button
            onClick={onToggle}
            className={cn(
              "w-full h-16 rounded-2xl text-lg font-black italic transition-all duration-300",
              isRunning
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            )}
          >
            {isRunning ? (
              <Pause className="mr-2 h-6 w-6" />
            ) : (
              <Play className="mr-2 h-6 w-6" />
            )}
            {isRunning ? "PAUSE" : "START"}
          </Button>
          <Button
            variant="ghost"
            onClick={onReset}
            className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 text-white font-bold italic"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> RESET
          </Button>
        </div>
      </div>
    </div>
  );
}