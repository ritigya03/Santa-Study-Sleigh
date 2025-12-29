import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ChristmasTree from './components/ChristmasTree'
import CameraController from './components/CameraController'
import { useState } from 'react'
import { AnimationState } from './types'

function App() {
  const [animationState, setAnimationState] = useState<AnimationState>('TREE')
  const [userRotation] = useState(0)

  const toggleState = () => {
    setAnimationState(prev => prev === 'TREE' ? 'EXPLODE' : 'TREE')
  }

  return (
    <div className="w-full h-full bg-[#050103] relative">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 50 }}
        onClick={toggleState}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#050103']} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#FFB7C5" />
        <spotLight
          position={[0, 20, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="#ffffff"
          castShadow
        />

        {/* Main Scene */}
        <ChristmasTree
          animationState={animationState}
          userRotation={userRotation}
        />

        <CameraController />

        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom
            intensity={2.0}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-white/80 text-sm font-light">
        <p className="mb-2">🖱️ Click to toggle Tree/Explode</p>
        <p className="text-xs opacity-60">(Gesture control disabled for testing)</p>
      </div>

      {/* Status indicator */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <div className="text-sm font-semibold">
          {animationState === 'TREE' ? '🎄 Tree Mode' : '💥 Explode Mode'}
        </div>
      </div>
    </div>
  )
}

export default App
