"use client"

import Link from "next/link"
import { Snowflake, Gift, Trees } from "lucide-react"
import { Snowfall } from "../../components/snowfall"

const WORKSHOPS = [
  { id: "cafe", title: "Cozy Café", icon: "☕" },
  { id: "snow", title: "Snowy Night", icon: "❄️" },
  { id: "fireplace", title: "Fireplace", icon: "🔥" },
  { id: "rain", title: "Calm Window", icon: "🌧️" },
  { id: "desk", title: "Minimal Desk", icon: "💼" },
  { id: "christmas", title: "Santa's Workshop", icon: "🎄" },
]

export default function WorkspaceSelect() {
  return (
    <main className="min-h-screen  bg-red-950  text-white px-8 py-6 relative overflow-hidden">
      {/* Christmas-themed background elements */}
      <Snowfall />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Snowflake className="absolute top-10 left-10 w-6 h-6 text-white/20 animate-pulse" />
        <Snowflake
          className="absolute top-32 right-20 w-8 h-8 text-white/15 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <Snowflake
          className="absolute bottom-20 left-1/4 w-5 h-5 text-white/10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <Snowflake
          className="absolute bottom-40 right-1/3 w-7 h-7 text-white/20 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Added festive icons */}
        <Gift className="absolute -bottom-10 -left-10 w-64 h-34 text-yellow-500 rotate-12" />
        <Gift className="absolute top-1/4 -right-10 w-32 h-32 text-yellow-500 -rotate-12" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
       
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-100 via-gold-200 to-red-200 drop-shadow-sm">
            Santa's Workspace
          </h1>
          <p className="text-red-100/80 text-lg font-medium">Choose a festive ambiance for your holiday productivity</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {WORKSHOPS.map((w) => (
            <Link key={w.id} href={`/workspace/${w.id}`}>
              <div className="group flex flex-col items-center cursor-pointer transform transition-all duration-300 hover:scale-105">
                {/* Circular Image Container */}
                <div className="relative mb-6 w-40 h-40">
                  {/* Festive glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-gold-400 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300" />

                  {/* Image container with gold border */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-red-400/50 group-hover:border-gold-300 transition-colors shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center text-6xl">
                      {w.icon}
                    </div>
                  </div>

                  {/* Ring animation on hover in gold */}
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-300 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-red-50 group-hover:text-gold-300 transition-colors duration-200">
                  {w.title}
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-red-200/60 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Enter the workshop →
                </p>
              </div>
            </Link>
          ))}
        </div>


      </div>
    </main>
  )
}
