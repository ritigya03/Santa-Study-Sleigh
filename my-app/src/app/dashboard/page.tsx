"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { TimerDisplay } from "../../components/timer/TimerDisplay";
import { Snowfall } from "../../components/snowfall";
import { usePomodoro, POMODORO_TIME } from "../../context/PomodoroContext";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import Image from "next/image";

const GIFT_EMOJIS = [
  "🧸", "🎈", "🍰", "🎀", "🦋", "🎵", "📚", "🌟", "🎨", "🎭",
  "🎪", "🎲", "🎸", "🎯", "🏆", "👑", "💎", "🌺", "🦄", "🚀",
];

interface Task {
  id: string;
  text: string;
  completed: boolean;
  articleEmoji: string;
}

function loadTasksFromStorage(): Task[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem("santaTasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((task: any, i: number) => ({
          id: task.id || String(i),
          text: task.text || task.name || `Task ${i + 1}`,
          completed: task.completed === true,
          articleEmoji: task.articleEmoji || GIFT_EMOJIS[i % GIFT_EMOJIS.length],
        }));
      }
    }
  } catch (e) {
    console.error("Error loading santaTasks:", e);
  }

  return [];
}

function saveTasksToStorage(tasks: Task[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("santaTasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Error saving santaTasks:", e);
  }
}

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage());
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [sleighPos, setSleighPos] = useState({ x: 50, y: 50 });
  const [sleighRotation, setSleighRotation] = useState(0);

  const {
    timeLeft,
    isRunning,
    sessionActive,
    toggleTimer,
    resetTimer,
  } = usePomodoro();

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  // Reload tasks when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const loadedTasks = loadTasksFromStorage();
        setTasks(loadedTasks);

        if (loadedTasks.length > 0) {
          const firstIncompleteIndex = loadedTasks.findIndex((t) => !t.completed);
          setCurrentTaskIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);

          if (loadedTasks.every((t) => t.completed)) {
            setShowCelebration(true);
          }
        }
      }
    };

    window.addEventListener("focus", () => {
      const loadedTasks = loadTasksFromStorage();
      setTasks(loadedTasks);

      if (loadedTasks.length > 0) {
        const firstIncompleteIndex = loadedTasks.findIndex((t) => !t.completed);
        setCurrentTaskIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);

        if (loadedTasks.every((t) => t.completed)) {
          setShowCelebration(true);
        }
      }
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // FIXED: Detect when timer completes - sessionActive becomes FALSE when timer ends
  useEffect(() => {
    if (timeLeft === 0 && isRunning === false && sessionActive === false) {
      completeTask();
    }
  }, [timeLeft, isRunning, sessionActive]);

  const updateSleighPosition = useCallback((percent: number) => {
    const path = document.getElementById("journeyPath") as SVGPathElement | null;
    if (!path) return;

    try {
      const length = path.getTotalLength();
      const point = path.getPointAtLength(length * (percent / 100));
      const nextPoint = path.getPointAtLength(
        Math.min(length, length * (percent / 100) + 1)
      );
      const angle =
        Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) *
        (180 / Math.PI);

      setSleighPos({ x: point.x, y: point.y });
      setSleighRotation(angle);
    } catch (e) {
      console.error("Path measurement error", e);
    }
  }, []);

  const journeyProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedSteps = tasks.filter((t) => t.completed).length;
    const currentSessionProgress = sessionActive
      ? (POMODORO_TIME - timeLeft) / POMODORO_TIME
      : 0;
    return (
      ((completedSteps + currentSessionProgress) / (tasks.length + 1)) * 100
    );
  }, [tasks, sessionActive, timeLeft]);

  useEffect(() => {
    const timeout = setTimeout(() => updateSleighPosition(journeyProgress), 50);
    return () => clearTimeout(timeout);
  }, [journeyProgress, updateSleighPosition]);

  // FIXED: Auto-complete current task and start next task
  const completeTask = useCallback(() => {
    setTasks((prev) => {
      const newTasks = prev.map((t, i) =>
        i === currentTaskIndex ? { ...t, completed: true } : t
      );

      // Check if all tasks are completed
      if (newTasks.every((t) => t.completed)) {
        setShowCelebration(true);
      } else {
        // AUTO-START NEXT TASK: Reset timer and toggle it on
        setTimeout(() => {
          resetTimer();
          toggleTimer(); // Start the timer for next task
        }, 500); // Small delay for UX
      }

      return newTasks;
    });
  }, [currentTaskIndex, resetTimer, toggleTimer]);

  // Update currentTaskIndex whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const firstIncompleteIndex = tasks.findIndex((t) => !t.completed);
      if (firstIncompleteIndex !== -1) {
        setCurrentTaskIndex(firstIncompleteIndex);
      }
    }
  }, [tasks]);

  const allTasksCompleted = tasks.length > 0 && tasks.every((t) => t.completed);

  return (
    <main className="min-h-screen bg-[#3f0000] text-slate-100 overflow-hidden relative font-sans">
      <Snowfall />

      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-linear-to-br from-blue-900/90 to-slate-900/90 border border-blue-400/30 p-12 rounded-[3rem] text-center max-w-md shadow-[0_0_50px_rgba(59,130,246,0.2)]"
          >
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-4xl font-black text-white mb-4 italic">
              JOURNEY COMPLETE
            </h2>
            <p className="text-blue-200/70 mb-8 leading-relaxed">
              All gifts have been delivered! Your productivity is as bright as the North Star.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => router.push("/celebration")}
                className="w-full h-14 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 italic"
              >
                🎁 FINAL DESTINATION REWARD
              </Button>
              <Button
                onClick={() => {
                  setTasks([]);
                  setShowCelebration(false);
                  setCurrentTaskIndex(0);
                  resetTimer();
                  localStorage.removeItem("santaTasks");
                }}
                className="w-full h-14 bg-white text-black font-bold rounded-2xl hover:bg-blue-50"
              >
                Start New Journey
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex flex-col gap-8">
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-6xl font-black tracking-tight text-white italic">
              STUDY ROUTE
            </h1>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {tasks.length === 0 ? (
            <div className="h-150 w-full bg-linear-to-br from-white/5 to-white/2 rounded-[2.5rem] border border-white/10 relative overflow-hidden backdrop-blur-sm shadow-2xl order-2 lg:order-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-black text-white/50 italic">No Tasks Found</p>
                <p className="text-lg text-white/30 mt-2">Add tasks from workspace to start your journey</p>
              </div>
            </div>
          ) : (
            <div className="h-150 w-full bg-linear-to-br from-white/5 to-white/2 rounded-[2.5rem] border border-white/10 relative overflow-hidden backdrop-blur-sm shadow-2xl order-2 lg:order-1">
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 400 500"
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <path
                  id="journeyPath"
                  d="M 50,50 C 150,50 250,150 350,150 S 250,250 50,250 S 250,350 350,350 S 300,450 200,450"
                  stroke="#FFD700"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="12 16"
                  filter="url(#glow)"
                  className="opacity-90 transition-all duration-1000"
                />
              </svg>

              <StartNode />

              {tasks.map((task, i) => {
                const progress = ((i + 1) / (tasks.length + 1)) * 100;
                return (
                  <JourneyNode
                    key={task.id}
                    task={task}
                    index={i}
                    progress={progress}
                  />
                );
              })}

              <motion.div
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${(sleighPos.x / 400) * 100}%`,
                  top: `${(sleighPos.y / 500) * 100}%`,
                }}
                animate={{
                  rotate: sleighRotation,
                }}
                transition={{
                  left: { type: "spring", damping: 30, stiffness: 50 },
                  top: { type: "spring", damping: 30, stiffness: 50 },
                  rotate: { type: "tween", duration: 0.3 },
                }}
              >
                <Image
                  src="/images/Santa-sleigh.png"
                  alt="Santa's Sleigh"
                  width={700}
                  height={420}
                  priority
                  className="h-20 md:h-35 w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
                />
              </motion.div>
            </div>
          )}

          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <TimerDisplay
              timeLeft={timeLeft}
              isRunning={isRunning}
              onToggle={toggleTimer}
              onReset={resetTimer}
              currentTaskText={tasks[currentTaskIndex]?.text || "No Task"}
              variant="full"
            />

            <Button
              onClick={() => router.push("/workspace")}
              className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 italic flex items-center justify-center gap-2"
            >
              GO TO WORKSPACE
            </Button>

            {allTasksCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Button
                  onClick={() => router.push("/celebration")}
                  className="w-full h-14 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 italic animate-pulse"
                >
                  🎁 FINAL DESTINATION
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StartNode() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const path = document.getElementById("journeyPath") as SVGPathElement | null;
    if (path) {
      const p = path.getPointAtLength(0);
      setPos({ x: p.x, y: p.y });
    }
  }, []);

  if (pos.x === 0) return null;

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{
        left: `${(pos.x / 400) * 100}%`,
        top: `${(pos.y / 500) * 100}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0, type: "spring" }}
    >
      <div className="relative group flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 border-2 border-white/20 shadow-lg flex items-center justify-center text-[10px] font-black text-white italic tracking-tighter" />
      </div>
    </motion.div>
  );
}

function JourneyNode({
  task,
  index,
  progress,
}: {
  task: Task;
  index: number;
  progress: number;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const path = document.getElementById("journeyPath") as SVGPathElement | null;
    if (path) {
      const length = path.getTotalLength();
      const p = path.getPointAtLength(length * (progress / 100));
      setPos({ x: p.x, y: p.y });
    }
  }, [progress]);

  if (pos.x === 0) return null;

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{
        left: `${(pos.x / 400) * 100}%`,
        top: `${(pos.y / 500) * 100}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: (index + 1) * 0.1, type: "spring" }}
    >
      <div className="relative group flex flex-col items-center">
        <div
          className={cn(
            "transition-all duration-700",
            task.completed &&
              "scale-125 brightness-125 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
          )}
        >
          <div className="text-5xl filter drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default">
            {task.completed ? "🎁" : task.articleEmoji}
          </div>
        </div>
      </div>
    </motion.div>
  );
}