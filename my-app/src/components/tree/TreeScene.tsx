"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

// IMPORT FROM THE TREE APP SRC
import ChristmasTree from "./christmas-tree-3d/src/components/ChristmasTree"
import CameraController from "./christmas-tree-3d/src/components/CameraController"
import GestureControl from "./christmas-tree-3d/src/components/GestureControl"
import { AnimationState } from "./christmas-tree-3d/src/types"

export default function TreeScene() {
  const [animationState, setAnimationState] =
    useState<AnimationState>("TREE")
  const [userRotation, setUserRotation] = useState(0)

  const toggleState = () => {
    setAnimationState(prev =>
      prev === "TREE" ? "EXPLODE" : "TREE"
    )
  }

  return (
    <div className="w-full h-full bg-[#050103] relative">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 50 }}
        onClick={toggleState}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#050103"]} />

        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#FFB7C5" />
        <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} />

        <ChristmasTree
          animationState={animationState}
          userRotation={userRotation}
        />

        <CameraController />

        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.1} />
        </EffectComposer>
      </Canvas>

      <GestureControl
        onStateChange={setAnimationState}
        onRotationChange={setUserRotation}
        currentState={animationState}
      />
    </div>
  )
}
