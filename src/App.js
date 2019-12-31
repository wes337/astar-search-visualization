import React from 'react'
import GridCanvas from './components/grid-canvas'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>A* Search Algorithm</p>
      </header>
      <div className="grid-container">
        <GridCanvas
          width={25}
          height={25}
          nodeSize={25}
          nodeStroke={2}
        />
      </div>
    </div>
  )
}

export default App
