import React, { useState, useLayoutEffect } from 'react'
import GridCanvas from './components/grid-canvas'
import './app.css'

function App() {
  const [canvasWidth, setCanvasWidth] = useState(25)
  const [canvasHeight, setCanvasHeight] = useState(25)

  useLayoutEffect(() => {
    function updateSize() {
      if (window.outerWidth < 576) {
        setCanvasWidth(10)
        setCanvasHeight(15)
      } else if (window.outerWidth < 768) {
        setCanvasWidth(15)
        setCanvasHeight(15)
      } else if (window.outerWidth < 992) {
        setCanvasWidth(25)
        setCanvasHeight(25)
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <p>A* Search Algorithm</p>
      </header>
      <div className="grid-container">
        <GridCanvas
          width={canvasWidth}
          height={canvasHeight}
          nodeSize={25}
          nodeStroke={2}
        />
      </div>
    </div>
  )
}

export default App
