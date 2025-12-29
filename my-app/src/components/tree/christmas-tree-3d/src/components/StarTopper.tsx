import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const StarTopper = () => {
  const starRef = useRef<THREE.Mesh>(null!)

  /* ================= Star Shape ================= */
  const starShape = new THREE.Shape()
  const outerRadius = 1.2
  const innerRadius = 0.5
  const points = 5

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (i === 0) starShape.moveTo(x, y)
    else starShape.lineTo(x, y)
  }
  starShape.closePath()

  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
  }

  /* ================= Animation ================= */
  useFrame((state) => {
    if (!starRef.current) return

    starRef.current.rotation.z += 0.01
    starRef.current.position.y =
      8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2

    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    starRef.current.scale.set(scale, scale, scale)
  })

  return (
    <>
      {/* ⭐ STAR GROUP */}
    <group position={[0, 1, 0]}>

        <mesh ref={starRef}>
          <extrudeGeometry args={[starShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={2}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          color="#FFD700"
          distance={15}
        />

        {/* Star-local sparkles */}
        <Sparkles
          count={120}
          scale={3}
          size={3}
          speed={0.6}
          opacity={0.9}
          color="#FFD700"
        />
      </group>

      {/* ✨ GLOBAL TREE SPARKLES (ALL OVER) */}
      <Sparkles
        count={400}
        scale={[10, 18, 10]}   // covers full tree volume
        position={[0, 1, 0]}   // center of tree
        size={1.8}
        speed={0.4}
        opacity={0.6}
        color="#FFD93D"        // warm yellow
      />

      {/* 🌸 SECONDARY PINK SPARKLES (SUBTLE) */}
      <Sparkles
        count={200}
        scale={[9, 16, 9]}
        position={[0, 1, 0]}
        size={1.2}
        speed={0.25}
        opacity={0.45}
        color="#AD1457"        // dark pink
      />
    </>
  )
}

export default StarTopper
