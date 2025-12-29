"use client";

import { Gift, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function TaskPath({ tasks }: { tasks: Task[] }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-150 mt-12 overflow-visible">
      {/* The Winding Snowy Path */}
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        preserveAspectRatio="none"
      >
        <path
          id="study-path"
          d="M100,500 C200,500 300,100 500,100 C700,100 800,500 900,500"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="60"
          strokeLinecap="round"
        />
        <path
          d="M100,500 C200,500 300,100 500,100 C700,100 800,500 900,500"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeDasharray="10 15"
          className="opacity-40"
        />
      </svg>

      {/* Santa Sleigh Progress */}
      <motion.div
        className="absolute z-20"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          offsetPath:
            "path('M100,500 C200,500 300,100 500,100 C700,100 800,500 900,500')",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        <div className="relative -translate-y-12 -translate-x-12">
          <Image
            src="/images/Santa-sleigh.png"
            alt="Santa Sleigh"
            width={120}
            height={80}
            className="drop-shadow-2xl"
          />
        </div>
      </motion.div>

      {/* Gifts (Tasks) along the path */}
      {tasks.map((task, index) => {
        const progress = ((index + 1) / (tasks.length + 1)) * 100;
        return (
          <motion.div
            key={task.id}
            className="absolute z-10 flex flex-col items-center group cursor-pointer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            style={{
              offsetPath:
                "path('M100,500 C200,500 300,100 500,100 C700,100 800,500 900,500')",
              offsetDistance: `${progress}%`,
            }}
          >
            <div className="relative -translate-y-10">
              {/* Tooltip/Task Name */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-red-900 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg">
                {task.text}
              </div>

              <div
                className={`p-3 rounded-xl transition-all duration-300 transform group-hover:scale-110 shadow-xl ${
                  task.completed
                    ? "bg-green-500/80 rotate-3"
                    : "bg-red-500/80 -rotate-3"
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <Gift className="w-8 h-8 text-white animate-bounce" />
                )}
              </div>

              <div className="mt-2 text-[10px] font-black text-white/80 uppercase tracking-widest text-center bg-black/20 px-2 rounded-full">
                Session {index + 1}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
