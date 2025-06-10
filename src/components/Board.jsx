import { useState } from 'react'
import { 
  astar,
  bfs,
  clearEntireBoard,
  clearVisited,
  copyBoard,
  createMatrixOfNodes,
  createMaze,
  getDistance
} from '../helpers/helpers.js';
import { di, dj, Search, Status } from '../constants.js'
import Tile from './Tile';

const Board = () => {
  const [board, setBoard] = useState(createMatrixOfNodes)
  const [state, setState] = useState(Search.NONE)
  const [target, setTarget] = useState()
  const [start, setStarting] = useState()
  const [holdingMouse, setHolding] = useState(false)
  const [isDrawing, setDrawingMode] = useState(false)

  const path = (status, fn) => {
    setState(status)
    setBoard(fn(start, target, board))
  }

  const generateMaze = () => {
    clearBoard()
    setBoard(createMaze)
  }

  const clearBoard = () => {
    setState(0)
    setHolding(false)
    setTarget(undefined)
    setDrawingMode(false)
    setStarting(undefined)
    setBoard(clearEntireBoard(board))
  }

  const handleHolding = (value, i, j) => {
    setHolding(value)
    if (value) handleClick(i, j)
  }

  const handleClick = (i, j) => {
    if (isDrawing) {
      if (start && i == start.i && j == start.j) return;
      if (target && i == target.i && j == target.j) return;

      let newBoard = copyBoard(board)
      if (newBoard[i][j].status != Status.WALL) {
        newBoard[i][j].status = Status.WALL
      } else {
        newBoard[i][j].status = Status.UNVISITED
      }
      setBoard(newBoard)
      if (state == 1) bfs()
      if (state == 2) astar()
      return
    }
    if (!start) {
      setStarting({ i, j })
      board[i][j].status = Status.START
    } else if (!target) {
      setTarget({ i, j })
      board[i][j].status = Status.TARGET
    }
    setBoard(board)
    if (state == 1) bfs()
    if (state == 2) astar()
    return
  }

  return (
    <>
      <div className="options">
        <button 
          className='search' 
          onClick={() => path(Search.BFS, bfs)} 
          disabled={!start || !target}
        >
          BFS
        </button>
        <button 
          className='search' 
          onClick={() => path(Search.ASTAR, astar)} 
          disabled={!start || !target}
        >
          A*
        </button>
        <button className='clear' onClick={clearBoard}>Clear</button>
        <button className='walls' onClick={() => setDrawingMode(!isDrawing)}>{isDrawing ? "Stop Drawing" : "Draw Walls"}</button>
        <button className='walls' onClick={generateMaze}>Create Maze</button>
      </div>
      <div className="container">
        {
          board.map((row, i) => (
            row.map((el, j) => <Tile
              key={el.id}
              status={el.status}
              handleClick={handleClick}
              isHolding={holdingMouse}
              handleHolding={handleHolding}
              position={{ i, j }}
            />)
          ))
        }
      </div >
    </>
  )
}

export default Board
