"use client"

import { useParams } from "next/navigation"
import { usePomodoro } from "../../../context/PomodoroContext"

const VIDEO_MAP: Record<string, string> = {
  cafe: "/video/cafe.mp4",
  snow: "/video/winter_snow.mp4",
  fireplace: "/video/fireplace.mp4",
  rain: "/video/rain.mp4",
  desk: "/video/night.mp4",
  christmas: "/video/christmas.mp4",
}

export default function WorkshopRoom() {
  const { id } = useParams()
  const videoSrc = VIDEO_MAP[id as string]
  
  // Use global timer from context
  const { timeLeft, isRunning, toggleTimer, resetTimer } = usePomodoro()

  if (!videoSrc) {
    return <div className="text-white">Workshop not found</div>
  }

  return (
    <div className="fixed inset-0 bg-black">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Global Timer Widget - Shows same time everywhere */}
      <div className="fixed top-8 right-8 z-50">
        <div className="bg-white/0  border border-white/10 rounded-3xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300">
          <div className="text-center">
            <div className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] italic">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={toggleTimer}
                className={`px-4 py-2 rounded-lg font-bold text-sm italic transition-all duration-300 backdrop-blur ${
                  isRunning
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-yellow-100/80 text-black hover:bg-yellow-200"
                }`}
              >
                {isRunning ? "PAUSE" : "START"}
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-sm italic hover:bg-white/20 transition-all duration-300 backdrop-blur"
              >
                RESET
              </button>
            </div>

            {/* {isRunning && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/70 uppercase tracking-wider">Running</span>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Optional: Bottom left info */}
      <div className="fixed bottom-8 left-8 z-50">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl px-4 py-3">
          <p className="text-sm text-white/80 uppercase tracking-widest font-bold">
            Study Mode
          </p>
        </div>
      </div>
    </div>
  )
}