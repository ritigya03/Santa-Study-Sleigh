import { useEffect, useState } from 'react'

interface WebGLCheckProps {
  children: React.ReactNode
}

const WebGLCheck = ({ children }: WebGLCheckProps) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setHasWebGL(!!gl)
  }, [])

  if (hasWebGL === false) {
    return (
      <div className="w-full h-full bg-[#050103] flex items-center justify-center p-8">
        <div className="bg-black/80 text-white p-8 rounded-lg max-w-2xl border-2 border-pink-500/30">
          <h1 className="text-3xl font-bold mb-4 text-pink-400">🎄 WebGL Required</h1>
          <p className="mb-4 text-lg">
            This interactive 3D Christmas tree requires WebGL to run, but it appears to be disabled in your browser.
          </p>

          <div className="bg-black/40 p-4 rounded mb-4">
            <p className="font-semibold mb-2 text-pink-300">💡 How to enable WebGL in Chrome:</p>
            <ol className="list-decimal ml-6 space-y-2 text-sm">
              <li>Go to <code className="bg-pink-900/30 px-2 py-1 rounded">chrome://settings/system</code></li>
              <li>Enable "Use hardware acceleration when available"</li>
              <li>Go to <code className="bg-pink-900/30 px-2 py-1 rounded">chrome://flags/#ignore-gpu-blocklist</code></li>
              <li>Set to "Enabled"</li>
              <li>Restart Chrome</li>
            </ol>
          </div>

          <div className="bg-black/40 p-4 rounded mb-4">
            <p className="font-semibold mb-2 text-pink-300">🏢 On a work/school computer?</p>
            <p className="text-sm">
              WebGL might be disabled by your IT administrator. Try using:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
              <li><strong>Microsoft Edge</strong> (usually enabled)</li>
              <li><strong>Firefox</strong></li>
              <li><strong>Your personal device</strong></li>
            </ul>
          </div>

          <div className="flex gap-4">
            <a
              href="https://get.webgl.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded transition-colors"
            >
              Test WebGL
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default WebGLCheck
