import Node from "./NodeClass.js"

export const di = [1, 0, -1, 0]
export const dj = [0, 1, 0, -1]

export const Status = {
  UNVISITED: 0,
  VISITED: 1,
  START: 2,
  TARGET: 3,
  WALL: 4,
  PATH: 5,
};

export const Movement = {
  NOTHING: 0,
  STARTING: 1,
  TARGET: 2,
  WALL: 3,
}

const createMatrixOfNodes = (rows, columns) => {
  let id = 1;
  const matrix = []
  for (let i = 0; i < rows; i++) {
    matrix.push([])
    for (let j = 0; j < columns; j++) {
      matrix[i].push(new Node(id));
      id++;
    }
  }
  return matrix;
}

export const base = createMatrixOfNodes(20, 40)
