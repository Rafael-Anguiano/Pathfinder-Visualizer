import Node from "./helpers/NodeClass"

export const di = [0, 1, 0, -1]
export const dj = [1, 0, -1, 0]

const rows = 21;
const columns = 41;

export const Status = {
  UNVISITED: 0,
  VISITED: 1,
  START: 2,
  TARGET: 3,
  WALL: 4,
  PATH: 5,
};

export const Search = {
  NONE: 0,
  BFS: 1,
  ASTAR: 2,
}

const createMatrixOfNodes = () => {
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

export const createMazeBase = () => {
  let id = 1;
  const matrix = []

  for (let i = 0; i < 21; i++) {
    matrix.push([])
    if (i % 2) {
      for (let j = 0; j< 41; j++) {
        if (j % 2 == 0) {
          matrix[i].push(new Node(id, Status.WALL, i, j));
        } else {
          matrix[i].push(new Node(id, Status.UNVISITED, i, j))
        }
        id++;
      }
    } else {
      for (let j = 0; j< columns; j++) {
        matrix[i].push(new Node(id, Status.WALL, i, j));
        id++;
      }
    }
  }

  return matrix;
}

const getUnvisitedNeightbours = (matrix, visited, curr) => {
  let posible = []

  // Up
  if (curr.row - 2 > 0 && !visited.has(matrix[curr.row - 2][curr.column].id)) {
    posible.push(matrix[curr.row - 2][curr.column])
  }

  // Down
  if (curr.row + 2 < rows - 1 && !visited.has(matrix[curr.row + 2][curr.column]?.id)) {
    posible.push(matrix[curr.row + 2][curr.column])
  }

  // Left
  if (curr.column - 2 > 0 && !visited.has(matrix[curr.row][curr.column - 2].id)) {
    posible.push(matrix[curr.row][curr.column - 2])
  }

  // Right
  if (curr.column + 2 < columns - 1 && !visited.has(matrix[curr.row][curr.column + 2].id)) {
    posible.push(matrix[curr.row][curr.column + 2])
  }

  return posible
}

export const createMaze = () => {
  const matrix = createMazeBase();

  const stack = []
  const visited = new Set()

  stack.push(matrix[1][1])
  visited.add(matrix[1][1].id)

  while (stack.length) {
    let curr = stack.pop();
    let unvisited = getUnvisitedNeightbours(matrix, visited, curr)

    if (unvisited.length) {
      stack.push(curr)
      let index = Math.floor(Math.random() * unvisited.length)
      let nextNode = unvisited[index]
      stack.push(nextNode)

      matrix[(curr.row + nextNode.row) / 2][(curr.column + nextNode.column) / 2].status = Status.UNVISITED

      visited.add(nextNode?.id)
    }

  }

  return matrix;
}

export const base = createMatrixOfNodes(rows, columns)
