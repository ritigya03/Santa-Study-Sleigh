import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AnimationState } from '../types'
import TreeLeaves from './TreeLeaves'
import TreeDecorations from './TreeDecorations'
import SpiralRibbon from './SpiralRibbon'
import StarTopper from './StarTopper'

interface ChristmasTreeProps {
  animationState: AnimationState
  userRotation: number
}

const ChristmasTree = ({ animationState, userRotation }: ChristmasTreeProps) => {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_state, delta) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.1

      // Apply user rotation smoothly
      const targetRotation = userRotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.1
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* Tree Leaves - Pink Octahedrons */}
      <TreeLeaves animationState={animationState} />

      {/* Decorations - Cubes and Icosahedrons */}
      <TreeDecorations animationState={animationState} />

      {/* Spiral Ribbon */}
      <SpiralRibbon animationState={animationState} />

      {/* Star Topper */}
      <StarTopper />

      {/* Holiday Text - Only visible in TREE mode */}
    
    </group>
  )
}

export default ChristmasTree
