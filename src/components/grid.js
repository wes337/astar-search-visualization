import GridNode from './grid-node.js'

export default class Grid {
  constructor(canvas, nodeSize, nodeStroke, w, h, gridNodes = [], startNode = null, endNode = null) {
    this.canvas = canvas
    this.nodeSize = nodeSize
    this.nodeStroke = nodeStroke
    this.w = w
    this.h = h
    this.gridNodes = gridNodes
    this.startNode = startNode
    this.endNode = endNode
  }

  get ctx() {
    if (this.canvas && this.canvas.getContext) {
      return this.canvas.getContext('2d')
    }
    return null
  }

  init() {
    let y = this.nodeStroke
    for (let i = 0; i < this.h; i++) {
      let x = this.nodeStroke
      for (let j = 0; j < this.w; j++) {
        this.addNode(x, y)
        x += this.nodeSize
      }
      y += this.nodeSize
    }
  }

  addNode(x, y) {
    const existingNode = this.gridNodes.find(node => node.x === x && node.y === y)
    if (!existingNode) {
      const gridNode = new GridNode(x, y, this.ctx, this.nodeSize, this.nodeStroke)
      this.gridNodes.push(gridNode)
    }
  }

  draw() {
    this.gridNodes.forEach((gridNode) => {
      gridNode.fill('white')
      gridNode.draw()
    })
  }

  setStartNode(gridNode) {
    this.startNode = gridNode
    gridNode && gridNode.fill('blue')
  }

  setEndNode(gridNode) {
    this.endNode = gridNode
    gridNode && gridNode.fill('red')
  }

  getAdjacentNodes(gridNode) {
    const neighbours = []
    const node0 = this.gridNodes.find((node) => {
      return node.x === gridNode.x && node.y === (gridNode.y - gridNode.size)
    })
    const node1 = this.gridNodes.find((node) => {
      return node.x === gridNode.x && node.y === (gridNode.y + gridNode.size)
    })
    const node2 = this.gridNodes.find((node) => {
      return node.x === (gridNode.x - gridNode.size) && node.y === gridNode.y 
    })
    const node3 = this.gridNodes.find((node) => {
      return node.x === (gridNode.x + gridNode.size) && node.y === gridNode.y
    })
    const node4 = this.gridNodes.find((node) => {
      return node.x === (gridNode.x + gridNode.size) && node.y === (gridNode.y - gridNode.size)
    })
    const node5 = this.gridNodes.find((node) => {
      return node.x === (gridNode.x - gridNode.size) && node.y === (gridNode.y - gridNode.size)
    })
    const node6 = this.gridNodes.find((node) => {
      return node.x === (gridNode.x + gridNode.size) && node.y === (gridNode.y + gridNode.size)
    })
    const node7 = this.gridNodes.find((node) => {
      return node.x === (gridNode.x - gridNode.size) && node.y === (gridNode.y + gridNode.size)
    })
  
    node0 && neighbours.push(node0)
    node1 && neighbours.push(node1)
    node2 && neighbours.push(node2)
    node3 && neighbours.push(node3)
    node4 && neighbours.push(node4)
    node5 && neighbours.push(node5)
    node6 && neighbours.push(node6)
    node7 && neighbours.push(node7)
  
    return neighbours
  }
}
