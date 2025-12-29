"use client"

import { useEffect, useRef, useState } from "react"
import { Music, Music2, ChevronUp } from "lucide-react"
import Button from "../ui/Button"

const TRACKS = [
  { name: "Cozy Café ☕", src: "/audio/cozy-cafe.mp3" },
  { name: "Winter Snow ❄️", src: "/audio/winter-snow.mp3" },
  { name: "Santa's Fav 🎄", src: "/audio/santa's-fav.mp3" },
  { name: "Lo-fi Fireplace 🔥", src: "/audio/lo-fi-fireplace.mp3" },
  { name: "Night Focus 🌙", src: "/audio/night-focus.mp3" },
]

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0])

  // Load track when changed
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.src)
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
    } else {
      audioRef.current.pause()
      audioRef.current.src = currentTrack.src
      audioRef.current.load()
    }

    if (isPlaying) {
      audioRef.current.play()
    }
  }, [currentTrack, isPlaying])

  // Play / pause
  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying((p) => !p)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end gap-2">
      {/* Track picker */}
      {showPicker && (
        <div className="bg-black/70 backdrop-blur-lg border border-white/20 rounded-2xl p-3 space-y-2 shadow-2xl">
          {TRACKS.map((track) => (
            <button
              key={track.src}
              onClick={() => {
                setCurrentTrack(track)
                setShowPicker(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                currentTrack.src === track.src
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {/* Picker toggle */}
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setShowPicker((s) => !s)}
          className="w-10 h-10 mt-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>

        {/* Play / pause */}
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleMusic}
          className="w-14 h-14 rounded-full shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all hover:scale-110"
        >
          {isPlaying ? (
            <Music2 className="h-7 w-7" />
          ) : (
            <Music className="h-7 w-7" />
          )}
          <span className="sr-only">Toggle Music</span>
        </Button>
      </div>
    </div>
  )
}
