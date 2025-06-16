import { Status, Search, rows, columns, di, dj, animationSpeed } from "../constants";
import Node from "./NodeClass"
import PriorityQueue from "./PriorityQueue"

// CREATE, CLEAR AND COPY BOARD
export const createMatrixOfNodes = () => {
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

export const copyBoard = (board) => {
  let newMatrix = []
  for (let i = 0; i < board.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < board[0].length; j++) {
      newMatrix[i].push(board[i][j])
    }
  }
  return newMatrix
}

export const clearVisited = (matrix) => {
  const newMatrix = []
  for (let i = 0; i < matrix.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < matrix[0].length; j++) {
      newMatrix[i].push(matrix[i][j])
      if (newMatrix[i][j].status == Status.VISITED || newMatrix[i][j].status == Status.PATH) newMatrix[i][j].status = Status.UNVISITED
    }
  }
  return newMatrix;
}

export const clearEntireBoard = (matrix) => {
  let newMatrix = []
  for (let i = 0; i < matrix.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < matrix[0].length; j++) {
      newMatrix[i].push(matrix[i][j])
      newMatrix[i][j].status = Status.UNVISITED
      newMatrix[i][j].clearPrev()
    }
  }
  return newMatrix
}

export const getDistance = (curr, target) => {
  return Math.abs(target.i - curr.i) + Math.abs(target.j - curr.j);
}

// CREATE MAZE
const createMazeBase = () => {
  let id = 1;
  const matrix = []

  for (let i = 0; i < rows; i++) {
    matrix.push([])
    if (i % 2) {
      for (let j = 0; j< columns; j++) {
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
  if (curr.row - 2 > 0 && !visited.has(matrix[curr.row - 2][curr.column]?.id)) {
    posible.push(matrix[curr.row - 2][curr.column])
  }

  // Down
  if (curr.row + 2 < rows - 1 && !visited.has(matrix[curr.row + 2][curr.column]?.id)) {
    posible.push(matrix[curr.row + 2][curr.column])
  }

  // Left
  if (curr.column - 2 > 0 && !visited.has(matrix[curr.row][curr.column - 2]?.id)) {
    posible.push(matrix[curr.row][curr.column - 2])
  }

  // Right
  if (curr.column + 2 < columns - 1 && !visited.has(matrix[curr.row][curr.column + 2]?.id)) {
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

// SEARCH ALGORITHMS
export const bfs = (start, target, matrix, setBoard, setState) => {
  let found = false;
  const visited = new Set();
  const board = clearVisited(matrix);
  const q = [{ i: start.i, j: start.j }];
  const visitedCells = [];
  const pathCells = [];
  let curr

  while (q.length) {
    curr = q.shift();

    if (visited.has(board[curr.i][curr.j].id)) continue;

    if (!(curr.i == start.i && curr.j == start.j)) {
      if (!(curr.i == target.i && curr.j == target.j)) {
        visitedCells.push({ i: curr.i, j: curr.j });
      }
      board[curr.i][curr.j].setPrev(curr.prev.i, curr.prev.j);
    }

    if (curr.i == target.i && curr.j == target.j) {
      found = true;
      break;
    }

    visited.add(board[curr.i][curr.j].id);

    for (let i = 0; i < 4; i++) {
      if (di[i] + curr.i < 0 || di[i] + curr.i >= board.length) continue;
      if (dj[i] + curr.j < 0 || dj[i] + curr.j >= board[0].length) continue;
      if (visited.has(board[di[i] + curr.i][dj[i] + curr.j])) continue;
      if (board[di[i] + curr.i][dj[i] + curr.j].status == Status.WALL) continue;

      q.push({ i: di[i] + curr.i, j: dj[i] + curr.j, prev: { i: curr.i, j: curr.j } });
    }
  }

  if (found) {
    curr = board[target.i][target.j];
    while (curr.id != board[start.i][start.j].id) {
      if (!(curr.prev.i == start.i && curr.prev.j == start.j)) {
        pathCells.unshift({ i: curr.prev.i, j: curr.prev.j });
      }
      let prev = curr.getPath();
      curr = board[prev.i][prev.j];
    }
  }

  // Animate the visited cells
  animateSearch(board, visitedCells, pathCells, setBoard, setState);
  
  return board;
}

export const astar = (start, target, matrix, setBoard, setState) => {
  let found = false;
  const visited = new Set();
  const board = clearVisited(matrix);
  const q = new PriorityQueue();
  q.addNode({ i: start.i, j: start.j, g: 0, h: getDistance(start, target) });
  const visitedCells = [];
  const pathCells = [];

  while (q.length) {
    const curr = q.top();
    if (visited.has(board[curr.i][curr.j].id)) continue;

    if (!(curr.i == start.i && curr.j == start.j)) {
      if (!(curr.i == target.i && curr.j == target.j)) {
        visitedCells.push({ i: curr.i, j: curr.j });
      }
      board[curr.i][curr.j].setPrev(curr.prev.i, curr.prev.j);
    }

    if (curr.i == target.i && curr.j == target.j) {
      found = true;
      break;
    }

    visited.add(board[curr.i][curr.j].id);

    for (let i = 0; i < 4; i++) {
      if (di[i] + curr.i < 0 || di[i] + curr.i >= board.length) continue;
      if (dj[i] + curr.j < 0 || dj[i] + curr.j >= board[0].length) continue;
      if (visited.has(board[di[i] + curr.i][dj[i] + curr.j].id)) continue;
      if (board[di[i] + curr.i][dj[i] + curr.j].status == Status.WALL) continue;

      q.addNode({ i: di[i] + curr.i, j: dj[i] + curr.j, prev: { i: curr.i, j: curr.j }, g: curr.g + 1, h: getDistance(curr, target) });
    }
  }

  if (found) {
    let curr = board[target.i][target.j];
    while (curr.id != board[start.i][start.j].id) {
      if (!(curr.prev.i == start.i && curr.prev.j == start.j)) {
        pathCells.unshift({ i: curr.prev.i, j: curr.prev.j });
      }
      let prev = curr.getPath();
      curr = board[prev.i][prev.j];
    }
  }

  animateSearch(board, visitedCells, pathCells, setBoard, setState);

  return board;
}

export const dfs = (start, target, matrix, setBoard, setState) => {
  const board = clearVisited(matrix);
  const stack = [{i: start.i, j: start.j}]
  const visited = new Set([ board[start.i][start.j].id ])
  const visitedCells = []
  const pathCells = []
  let found = false;

  while (stack.length) {
    const curr = stack.pop()

    if (curr.i == target.i && curr.j == target.j) {
      found = true;
      break;
    }

    if (curr.i != start.i || curr.j != start.j) visitedCells.push({i: curr.i, j: curr.j})
    visited.add(board[curr.i][curr.j].id)

    for (let i = 0; i < 4; i++) {
      if (di[i] + curr.i < 0 || di[i] + curr.i >= board.length) continue;
      if (dj[i] + curr.j < 0 || dj[i] + curr.j >= board[0].length) continue;
      if (visited.has(board[di[i] + curr.i][dj[i] + curr.j].id)) continue;
      if (board[di[i] + curr.i][dj[i] + curr.j].status == Status.WALL) continue;

      stack.push({ i: di[i] + curr.i, j: dj[i] + curr.j})
      board[di[i] + curr.i][dj[i] + curr.j].setPrev(curr.i, curr.j)
    }
  }

  if (found) {
    let curr = board[target.i][target.j];
    while (curr.id != board[start.i][start.j].id) {
      if (!(curr.prev.i == start.i && curr.prev.j == start.j)) {
        pathCells.unshift({ i: curr.prev.i, j: curr.prev.j });
      }
      let prev = curr.getPath();
      curr = board[prev.i][prev.j];
    }
  }


  animateSearch(board, visitedCells, pathCells, setBoard, setState);

  return board;
}

// ANIMATION
const animateSearch = (board, visitedCells, pathCells, setBoard, setState) => {
  // First animate the visited cells
  for (let i = 0; i < visitedCells.length; i++) {
    setTimeout(() => {
      const newBoard = copyBoard(board);
      const cell = visitedCells[i];
      newBoard[cell.i][cell.j].status = Status.VISITED;
      setBoard(newBoard);
      
      // After all visited cells are animated, animate the path
      if (i === visitedCells.length - 1) {
        if (!pathCells.length) {
          setState(Search.NONE)
        } else {
          animatePath(board, pathCells, setBoard, setState);
        }
      }
    }, i * animationSpeed);
  }
}

const animatePath = (board, pathCells, setBoard, setState) => {
  for (let i = 0; i < pathCells.length; i++) {
    setTimeout(() => {
      const newBoard = copyBoard(board);
      const cell = pathCells[i];
      newBoard[cell.i][cell.j].status = Status.PATH;
      setBoard(newBoard);
      if (i === pathCells.length - 1 ) {
        setState(Search.NONE)
      }
    }, i * animationSpeed);
  }
}
