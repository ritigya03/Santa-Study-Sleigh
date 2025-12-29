import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import ErrorBoundary from './components/ErrorBoundary.js'
import WebGLCheck from './components/WebGLCheck.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WebGLCheck>
        <App />
      </WebGLCheck>
    </ErrorBoundary>
  </React.StrictMode>,
)
