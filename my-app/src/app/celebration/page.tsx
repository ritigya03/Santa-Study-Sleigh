"use client"

import dynamic from "next/dynamic"
import { Snowfall } from "../../components/snowfall"

const TreeScene = dynamic(
  () => import("../../components/tree/TreeScene"),
  { ssr: false }
)

export default function CelebrationPage() {
  return (
    <div className="w-screen h-screen bg-black">
    <Snowfall></Snowfall>
      <TreeScene />
    </div>
  )
}
