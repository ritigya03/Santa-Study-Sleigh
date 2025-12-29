import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function App() {
  return (
    <div className="w-full h-full bg-[#050103] relative">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 50 }}
      >
        <color attach="background" args={['#050103']} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

        {/* Simple test mesh */}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#FFB7C5" emissive="#FF69B4" emissiveIntensity={0.5} />
        </mesh>

        <OrbitControls />
      </Canvas>

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-white text-sm">
        <p>🎄 Simple Test - If you see a pink box, Three.js is working!</p>
      </div>
    </div>
  )
}

export default App
