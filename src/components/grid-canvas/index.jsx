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
  const canvasHeight = 640
  const canvasWidth = 640

  const resetGrid = () => {
    setStartNodeLocation(null)
    setEndNodeLocation(null)
    const canvas = gridCanvas.current
    const newGrid = new Grid(canvas, nodeSize, nodeStroke, width, height)
    newGrid.init()
    setGrid(newGrid)
  }

  const animatePath = (path, timeoutIndex, speed, color) => {
    let newTimeoutIndex = timeoutIndex
    path.forEach((node) => {
      newTimeoutIndex++
      setTimeout(() => node.fill(color), newTimeoutIndex * speed)
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
    animatePath(openClosedList, timeoutIndex, 15, 'lightgreen')
      .then(timeoutIndex => animatePath(path, timeoutIndex, 15, 'green'))
      .then(timeoutIndex => Promise.all([
        animatePath([startNode], timeoutIndex, 15, 'blue'),
        animatePath([endNode], timeoutIndex, 15, 'red')
      ]))
  }

  useEffect(() => {
    resetGrid()
  }, [])

  useLayoutEffect(() => {
    grid.draw()
  }, [grid])

  const handleClick = (event) => {
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
        setStartNodeLocation(gridNode.location())
      } else if (grid.startNode && !grid.endNode) {
        grid.setEndNode(gridNode)
        setEndNodeLocation(gridNode.location())
      } else if (grid.startNode && grid.endNode) {
        gridNode.setWalkable(!gridNode.walkable)
      } else {
        resetGrid()
      }
    } else {
      event.preventDefault()
    }
  }

  return (
    <div className="grid-canvas">
      <canvas className="grid" height={canvasHeight} width={canvasWidth} onClick={handleClick} ref={gridCanvas} />
      <div className="grid-canvas-footer">
        <div className="grid-canvas-labels">
          <div id="start-node-label">
            {startNodeLocation
              ? `Start Node: ${startNodeLocation}`
              : 'Start node is not set. Click a node to set it.'
            }
          </div>
          <div id="end-node-label">
            {endNodeLocation
              ? `End Node: ${endNodeLocation}`
              : 'End node is not set. Click a node to set it.'
            }
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
