export default class PriorityQueue extends Array {
  addNode (value) {
    this.push(value)
    this.sort((a, b) => {
      if (a.g + a.h != b.g + b.h) return (a.g + a.h) - (b.g + b.h)
      return a.h - b.h
    })
  }
  top () {
    return this.shift()
  }
}
