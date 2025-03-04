import { Status } from "./constants"

export default class Node {
  constructor(id) {
    this.id = id
    this.status = Status.UNVISITED
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
