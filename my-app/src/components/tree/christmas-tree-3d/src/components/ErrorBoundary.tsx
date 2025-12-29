import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-[#050103] flex items-center justify-center p-8">
          <div className="bg-black/60 text-white p-8 rounded-lg max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">🎄 Oops! Something went wrong</h1>
            <p className="mb-4">The Christmas tree failed to load. This might be due to:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li>Browser compatibility (try Chrome, Edge, or Firefox)</li>
              <li>WebGL not enabled or supported</li>
              <li>Camera permissions (not required for basic view)</li>
            </ul>
            <details className="mt-4">
              <summary className="cursor-pointer text-pink-400">Error details</summary>
              <pre className="mt-2 p-4 bg-black/40 rounded text-xs overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
