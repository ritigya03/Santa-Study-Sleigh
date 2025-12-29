import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AnimationState } from '../types'

interface TreeLeavesProps {
  animationState: AnimationState
}

const TreeLeaves = ({ animationState }: TreeLeavesProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const COUNT = 5000

  // Store tree and explode positions
  const positions = useMemo(() => {
    const treePos: THREE.Vector3[] = []
    const explodePos: THREE.Vector3[] = []
    const currentPos: THREE.Vector3[] = []

    for (let i = 0; i < COUNT; i++) {
      // Tree position - cone shape
      const t = i / COUNT
      const y = t * 15 - 8.5 // Height from -12 to 12 
      // // Height from -8 to 8
      const radius = (1 - t) * 5.8 + 0.9// Wider at bottom
      const angle = t * Math.PI * 8 + Math.random() * Math.PI * 0.5

      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3

      treePos.push(new THREE.Vector3(x, y, z))

      // Explode position - random sphere
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = 15 + Math.random() * 10

      explodePos.push(new THREE.Vector3(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
      ))

      // Initial position
      currentPos.push(treePos[i].clone())
    }

    return { treePos, explodePos, currentPos }
  }, [])

  // Initialize instances
  useEffect(() => {
    const dummy = new THREE.Object3D()

    for (let i = 0; i < COUNT; i++) {
      dummy.position.copy(positions.currentPos[i])

      // Random rotation
      dummy.rotation.x = Math.random() * Math.PI
      dummy.rotation.y = Math.random() * Math.PI
      dummy.rotation.z = Math.random() * Math.PI

      // Random scale
      const scale = 0.15 + Math.random() * 0.15
      dummy.scale.set(scale, scale, scale)

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [])

  // Animation loop
  useFrame(() => {
    const dummy = new THREE.Object3D()
    const target = animationState === 'TREE' ? positions.treePos : positions.explodePos

    for (let i = 0; i < COUNT; i++) {
      // Lerp to target position
      positions.currentPos[i].lerp(target[i], 0.05)

      dummy.position.copy(positions.currentPos[i])

      // Continuous rotation
      const time = Date.now() * 0.0005
      dummy.rotation.x += 0.01
      dummy.rotation.y += 0.01

      // Random scale variation
      const scale = 0.15 + Math.sin(time + i * 0.1) * 0.05
      dummy.scale.set(scale, scale, scale)

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
    color="#FFD93D"        
  emissive="#4CAF50"    
  emissiveIntensity={1.3}
  metalness={0.5}
  roughness={0.25}
/>

    </instancedMesh>
  )
}

export default TreeLeaves
