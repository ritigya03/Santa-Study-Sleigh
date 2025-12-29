import { useEffect, useRef, useState } from 'react'
import { HandLandmarker, FilesetResolver, HandLandmarkerResult } from '@mediapipe/tasks-vision'

export type GestureType = 'pinch' | 'open' | 'none'

interface HandPosition {
  x: number
  y: number
}

export const useHandGesture = () => {
  const [gesture, setGesture] = useState<GestureType>('none')
  const [handPosition, setHandPosition] = useState<HandPosition>({ x: 0.5, y: 0.5 })
  const [isReady, setIsReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const handLandmarkerRef = useRef<HandLandmarker | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const lastHandXRef = useRef<number>(0.5)

  useEffect(() => {
    let mounted = true

    const initializeHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        if (!mounted) return

        handLandmarkerRef.current = handLandmarker

        // Setup video stream
        const video = document.createElement('video')
        video.autoplay = true
        video.playsInline = true
        videoRef.current = video

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user'
          }
        })

        video.srcObject = stream
        await video.play()

        if (mounted) {
          setIsReady(true)
          detectHands()
        }
      } catch (error) {
        console.error('Error initializing hand tracking:', error)
      }
    }

    const detectHands = () => {
      if (!videoRef.current || !handLandmarkerRef.current || !mounted) return

      const video = videoRef.current
      const handLandmarker = handLandmarkerRef.current

      const detect = () => {
        if (!mounted || !video || video.readyState !== 4) {
          animationFrameRef.current = requestAnimationFrame(detect)
          return
        }

        const startTimeMs = performance.now()
        const results = handLandmarker.detectForVideo(video, startTimeMs)

        processHandResults(results)
        animationFrameRef.current = requestAnimationFrame(detect)
      }

      detect()
    }

    const processHandResults = (results: HandLandmarkerResult) => {
      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0]

        // Get hand center (wrist)
        const wrist = landmarks[0]
        setHandPosition({ x: wrist.x, y: wrist.y })
        lastHandXRef.current = wrist.x

        // Detect gesture
        const detectedGesture = detectGestureType(landmarks)
        setGesture(detectedGesture)
      } else {
        setGesture('none')
      }
    }

    const detectGestureType = (landmarks: any[]): GestureType => {
      // Thumb tip (4), Index tip (8), Middle tip (12), Ring tip (16), Pinky tip (20)
      // Palm base (0), Index base (5)

      const thumbTip = landmarks[4]
      const indexTip = landmarks[8]
      const middleTip = landmarks[12]
      const ringTip = landmarks[16]
      const pinkyTip = landmarks[20]
      const indexBase = landmarks[5]

      // Calculate distances
      const thumbIndexDist = Math.hypot(
        thumbTip.x - indexTip.x,
        thumbTip.y - indexTip.y
      )

      // Pinch/Grab detection - thumb and index close together
      if (thumbIndexDist < 0.05) {
        return 'pinch'
      }

      // Open hand detection - all fingers extended
      const indexExtended = indexTip.y < indexBase.y
      const middleExtended = middleTip.y < indexBase.y
      const ringExtended = ringTip.y < indexBase.y
      const pinkyExtended = pinkyTip.y < indexBase.y

      if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
        return 'open'
      }

      return 'none'
    }

    initializeHandLandmarker()

    return () => {
      mounted = false

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }

      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close()
      }
    }
  }, [])

  return {
    gesture,
    handPosition,
    isReady,
    videoElement: videoRef.current
  }
}
