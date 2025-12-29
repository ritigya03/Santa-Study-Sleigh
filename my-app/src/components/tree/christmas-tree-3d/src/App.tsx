import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ChristmasTree from './components/ChristmasTree'
import CameraController from './components/CameraController'
import GestureControl from './components/GestureControl'
import { useState } from 'react'
import { AnimationState } from './types'

function App() {
  const [animationState, setAnimationState] = useState<AnimationState>('TREE')
  const [userRotation, setUserRotation] = useState(0)

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

      {/* Gesture Control UI */}
      <GestureControl
        onStateChange={setAnimationState}
        onRotationChange={setUserRotation}
        currentState={animationState}
      />

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-white/80 text-sm font-light">
        <p className="mb-2">🖱️ Click to toggle Tree/Explode</p>
        <p className="mb-2">✋ Pinch/Grab → Tree Mode</p>
        <p className="mb-2">🤚 Open Hand → Explode Mode</p>
        <p>👋 Move Hand → Rotate Scene</p>
      </div>
    </div>
  )
}

export default App
