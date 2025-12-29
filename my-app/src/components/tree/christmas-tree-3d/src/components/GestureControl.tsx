import { useEffect, useRef, useState } from 'react'
import { AnimationState } from '../types'
import { useHandGesture } from '../hooks/useHandGesture'

interface GestureControlProps {
  onStateChange: (state: AnimationState) => void
  onRotationChange: (rotation: number) => void
  currentState: AnimationState
}

const GestureControl = ({ onStateChange, onRotationChange, currentState }: GestureControlProps) => {
  const { gesture, handPosition, isReady, videoElement } = useHandGesture()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const lastHandXRef = useRef(0.5)
  const rotationRef = useRef(0)

  // Update state based on gesture
  useEffect(() => {
    if (gesture === 'pinch' && currentState !== 'TREE') {
      onStateChange('TREE')
    } else if (gesture === 'open' && currentState !== 'EXPLODE') {
      onStateChange('EXPLODE')
    }
  }, [gesture, currentState, onStateChange])

  // Handle hand movement for rotation
  useEffect(() => {
    if (gesture === 'open' && handPosition.x !== lastHandXRef.current) {
      const deltaX = handPosition.x - lastHandXRef.current
      const rotationSpeed = 8 // High sensitivity

      rotationRef.current += deltaX * rotationSpeed
      onRotationChange(rotationRef.current)

      lastHandXRef.current = handPosition.x
    }
  }, [handPosition, gesture, onRotationChange])

  // Update cursor position
  useEffect(() => {
    if (isReady) {
      setCursorPosition({
        x: handPosition.x * window.innerWidth,
        y: handPosition.y * window.innerHeight
      })
    }
  }, [handPosition, isReady])

  // Draw video preview
  useEffect(() => {
    if (!canvasRef.current || !videoElement || !isReady) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const draw = () => {
      if (videoElement.readyState === 4) {
        // Mirror flip
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(videoElement, -canvas.width, 0, canvas.width, canvas.height)
        ctx.restore()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [videoElement, isReady])

  if (!isReady) {
    return (
      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg">
        Initializing camera...
      </div>
    )
  }

  return (
    <>
      {/* Camera Preview */}
      <div className="absolute bottom-4 right-4 rounded-lg overflow-hidden border-2 border-pink-500/50 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={240}
          height={180}
          className="block"
        />
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {gesture === 'pinch' && '✊ Pinch - Tree Mode'}
          {gesture === 'open' && '🤚 Open - Explode Mode'}
          {gesture === 'none' && '👋 Show hand'}
        </div>
      </div>

      {/* Custom Cursor */}
      {gesture !== 'none' && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-100"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 w-12 h-12 bg-pink-500/30 rounded-full blur-xl animate-pulse" />

            {/* Main cursor */}
            <div className="relative w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full border-2 border-white shadow-lg">
              {/* Inner dot */}
              <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full" />
            </div>

            {/* Gesture indicator */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl">
              {gesture === 'pinch' ? '✊' : '🤚'}
            </div>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <div className="text-xs mb-1 opacity-70">Gesture Control Active</div>
        <div className="text-sm font-semibold">
          {currentState === 'TREE' ? '🎄 Tree Mode' : '💥 Explode Mode'}
        </div>
      </div>
    </>
  )
}

export default GestureControl
