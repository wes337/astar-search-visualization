function getDistance(node, goalNode) {
  const diagonalCost = 1.4
  const distanceX = Math.abs(node.x - goalNode.x)
  const distanceY = Math.abs(node.y - goalNode.y)

  return (distanceX + distanceY) + (diagonalCost - 2) * Math.min(distanceX, distanceY)
}

function retracePath(startNode, endNode) {
  const path = []
  let currentNode = endNode

  while (currentNode !== startNode) {
    path.push(currentNode)
    currentNode = currentNode.parent
  }
  return path.reverse()
}

export default function findPath(grid) {
  const { startNode, endNode } = grid
  let openList = []
  let closedList = []

  startNode.h = getDistance(startNode, endNode)
  openList.push(startNode)

  while (openList.length > 0) {
    let currentNode = openList[0]
    let spliceIndex = 0
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f <= currentNode.f && openList[i].h < currentNode.h) {
        currentNode = openList[i]
        spliceIndex = i
      }
    }
    openList.splice(spliceIndex, 1)
    closedList.push(currentNode)

    if (currentNode === endNode) {
      const path = retracePath(startNode, endNode)
      return {
        path, startNode, endNode, closedList, openList
      }
    }

    const adjacentNodes = grid.getAdjacentNodes(currentNode)
    adjacentNodes.forEach((node) => {
      const closedListedNode = closedList.find(closedNode => closedNode === node)
      if (node.walkable && !closedListedNode) {
        const newNodeCost = currentNode.g + getDistance(currentNode, node)
        const openListedNode = openList.find(openedNode => openedNode === node)
        if (newNodeCost < node.g || !openListedNode) {
          node.g = newNodeCost
          node.h = getDistance(node, endNode)
          node.parent = currentNode
          if (!openListedNode) {
            openList.push(node)
          }
        }
      }
    })
  }
}