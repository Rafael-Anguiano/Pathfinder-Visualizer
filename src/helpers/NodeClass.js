import { Status } from "../constants"

export default class Node {
  constructor(id, status = Status.UNVISITED, row = 0, col = 0) {
    this.id = id
    this.status = status
    this.row = row,
    this.column = col
  }

  setPrev(i, j) {
    this.prev = { i, j }
  }

  clearPrev() {
    this.prev = undefined
  }

  getPath() {
    return this.prev
  }
};
