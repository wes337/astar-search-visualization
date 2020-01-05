import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Grid from '../grid'
import findPath from '../../algorithm'
import './grid-canvas.css'

function GridCanvas(props) {
  const { width, height, nodeSize, nodeStroke } = props
  const gridCanvas = useRef()
  const [grid, setGrid] = useState(new Grid())
  const [startNodeLocation, setStartNodeLocation] = useState(null)
  const [endNodeLocation, setEndNodeLocation] = useState(null)
  const [clickReset, setClickReset] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(5)

  const canvasHeight = (nodeSize * height) + (2 * nodeStroke)
  const canvasWidth = (nodeSize * width) + (2 * nodeStroke)

  const resetGrid = () => {
    setClickReset(false)
    setStartNodeLocation(null)
    setEndNodeLocation(null)
    const canvas = gridCanvas.current
    const newGrid = new Grid(canvas, nodeSize, nodeStroke, width, height)
    newGrid.init()
    setGrid(newGrid)
  }

  const animatePath = (path, timeoutIndex, color) => {
    let newTimeoutIndex = timeoutIndex
    path.forEach((node) => {
      newTimeoutIndex++
      setTimeout(() => node.fill(color), (newTimeoutIndex * animationSpeed))
    })
    return Promise.resolve(newTimeoutIndex)
  }

  const clickFindPath = grid => {
    let timeoutIndex = 0
    const { path, openList, closedList, startNode, endNode } = findPath(grid)
    const openClosedList = [...openList, ...closedList].sort((aNode, bNode) => {
      if (aNode.f <= bNode.f && aNode.h <= bNode.h) {
        return 1
      }
      return -1
    })
    animatePath(openClosedList, timeoutIndex, 'lightgreen')
      .then(timeoutIndex => animatePath(path, timeoutIndex, 'green'))
      .then(timeoutIndex => Promise.all([
        animatePath([startNode], timeoutIndex, 'blue'),
        animatePath([endNode], timeoutIndex, 'red')
      ]))
      .then(() => setClickReset(true))
  }

  useEffect(() => {
    resetGrid()
  }, [])

  useLayoutEffect(() => {
    grid.draw()
  }, [grid, height, width])

  const handleClick = (event) => {
    if (clickReset) {
      return resetGrid()
    }
    const canvas = gridCanvas.current
    const canvasLeft = canvas.offsetLeft
    const canvasTop = canvas.offsetTop

    const x = event.pageX - canvasLeft
    const y = event.pageY - canvasTop
    const gridNode = grid.gridNodes.find((node) => {
      return y > node.y && y < node.y + node.size && x > node.x && x < node.x + node.size
    })
    if (gridNode) {
      if ((!grid.startNode && !grid.endNode)) {
        grid.setStartNode(gridNode)
        return setStartNodeLocation(gridNode.location())
      } else if (grid.startNode && !grid.endNode) {
        grid.setEndNode(gridNode)
        return setEndNodeLocation(gridNode.location())
      } else if (grid.startNode && grid.endNode) {
        return gridNode.setWalkable(!gridNode.walkable)
      }
    }
    return event.preventDefault()
  }

  const RenderHeaderText = () => {
    if (!startNodeLocation) {
      return <p>Click a node to set the <span style={{ color: 'blue', backgroundColor: 'azure', padding: '0 0.2rem', borderRadius: '0.2rem' }}>START</span> position.</p>
    }
    if (!endNodeLocation) {
      return <p>Click a node to set the <span style={{ color: 'red', backgroundColor: 'azure', padding: '0 0.2rem', borderRadius: '0.2rem' }}>END</span> position.</p>
    }
    if (clickReset) {
      return (
        <p>Drawing shortest path from&nbsp;
          <span style={{ color: 'blue', backgroundColor: 'azure', padding: '0 0.2rem', borderRadius: '0.2rem' }}>{startNodeLocation}</span> to&nbsp;
          <span style={{ color: 'red', backgroundColor: 'azure', padding: '0 0.2rem', borderRadius: '0.2rem' }}>{endNodeLocation}</span>&nbsp;
          <em style={{ color: 'lightgray', fontWeight: 300 }}>(Click anywhere to reset)</em>
        </p>
      )
    }
    return <p>Click nodes to create/remove <span style={{ color: 'black', backgroundColor: 'azure', padding: '0 0.2rem', borderRadius: '0.2rem' }}>WALL</span> obstacles.</p>
  }

  return (
    <div className="grid-canvas">
      <div className="grid-canvas-header">
        <RenderHeaderText />
      </div>
      <canvas className="grid" height={canvasHeight} width={canvasWidth} onClick={handleClick} ref={gridCanvas} />
      <div className="grid-canvas-footer">
        <div className="grid-canvas-labels">
          <div id="start-node-label">
            {startNodeLocation
              ? `Start Node: ${startNodeLocation}`
              : 'Start node is not set.'
            }
          </div>
          <div id="end-node-label">
            {endNodeLocation
              ? `End Node: ${endNodeLocation}`
              : 'End node is not set.'
            }
          </div>
        </div>
        <div className="grid-canvas-speed">
          <p>Animation speed:</p>
          <div>
            <input type="radio" id="slow" name="speed" onChange={() => setAnimationSpeed(25)} />
            <label htmlFor="slow">Slow</label>
          </div>
          <div>
            <input type="radio" id="normal" name="speed" checked onChange={() => setAnimationSpeed(5)} />
            <label htmlFor="normal">Normal</label>
          </div>
          <div>
            <input type="radio" id="fast" name="speed" onChange={() => setAnimationSpeed(1)} />
            <label htmlFor="fast">Fast</label>
          </div>
        </div>
        <div className="grid-canvas-controls">
          <button id="btn find-path" type="button" onClick={() => clickFindPath(grid)}>Find Path</button>
          <button id="btn clear" type="button" onClick={() => resetGrid()}>Clear</button>
        </div>
      </div>
    </div>
  )
}

export default GridCanvas
