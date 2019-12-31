export default class GridNode {
  constructor(x, y, ctx, size, stroke, f = 0, g = 0, h = 0, parent = undefined, walkable = true) {
    this.x = x
    this.y = y
    this.ctx = ctx
    this.size = size
    this.stroke = stroke
    this.f = f
    this.g = g
    this.h = h
    this.parent = parent
    this.walkable = walkable
  }

  setWalkable(walkable) {
    this.walkable = walkable
    if (walkable) {
      this.fill('white')
      this.draw()
    } else if (!walkable) {
      this.fill('black')
    }
  }

  location() {
    const x = Math.round((this.x / this.size) + 1)
    const y = Math.round((this.y / this.size) + 1)
    return `${x}, ${y}`
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.lineWidth = this.stroke
    this.ctx.strokeStyle = 'gray'
    this.ctx.rect(this.x, this.y, this.size, this.size)
    this.ctx.stroke()
  }

  fill(color) {
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.fillRect(this.x, this.y, this.size, this.size)
  }
}
