import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'

const CameraController = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 25)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(() => {
    // Smooth camera movements can be added here if needed
  })

  return null
}

export default CameraController
