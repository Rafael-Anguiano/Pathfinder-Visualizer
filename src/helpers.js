import { Status } from "./constants";

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

