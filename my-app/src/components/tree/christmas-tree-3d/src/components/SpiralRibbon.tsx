import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AnimationState } from '../types'

interface SpiralRibbonProps {
  animationState: AnimationState
}

const SpiralRibbon = ({ animationState }: SpiralRibbonProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const COUNT = 300 // Tetrahedrons forming the spiral

  const positions = useMemo(() => {
    const treePos: THREE.Vector3[] = []
    const explodePos: THREE.Vector3[] = []
    const currentPos: THREE.Vector3[] = []

    // Create 3 spiral turns around the tree
    const turns = 3
    const heightRange = 14

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT

      // Spiral parameters
      const y = t * heightRange - 7 // From -7 to 7
      const radius = (1 - t) * 3.5 + 1.0 // Wider at bottom
      const angle = t * Math.PI * 2 * turns

      treePos.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ))

      // Explode - scatter far away
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = 25 + Math.random() * 10

      explodePos.push(new THREE.Vector3(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
      ))

      currentPos.push(treePos[i].clone())
    }

    return { treePos, explodePos, currentPos }
  }, [])

  useFrame(() => {
    const dummy = new THREE.Object3D()
    const target = animationState === 'TREE' ? positions.treePos : positions.explodePos

    for (let i = 0; i < COUNT; i++) {
      positions.currentPos[i].lerp(target[i], 0.05)
      dummy.position.copy(positions.currentPos[i])

      // Smooth rotation
      dummy.rotation.x = Date.now() * 0.0005 + i * 0.1
      dummy.rotation.y = Date.now() * 0.0003 + i * 0.05

      const scale = 0.08
      dummy.scale.set(scale, scale, scale)

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <tetrahedronGeometry args={[1, 0]} />
     <meshStandardMaterial
  color="#FFD700"          // gold base
  emissive="#FFB000"       // warm glow
  emissiveIntensity={3.2}  // subtle glow (not white-hot)
  metalness={3.1}            // very metallic
  roughness={0.2}          // smooth & shiny
/>

    </instancedMesh>
  )
}

export default SpiralRibbon
