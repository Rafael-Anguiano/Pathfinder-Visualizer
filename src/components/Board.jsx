import { useState } from 'react'
import { 
  astar,
  bfs,
  dfs,
  clearEntireBoard,
  clearVisited,
  copyBoard,
  createMaze,
} from '../helpers/helpers.js';
import { Search, Status } from '../constants.js'
import Tile from './Tile';

const Board = () => {
  const [board, setBoard] = useState(createMaze)
  const [state, setState] = useState(Search.NONE)
  const [target, setTarget] = useState()
  const [start, setStarting] = useState()
  const [holdingMouse, setHolding] = useState(false)
  const [isDrawing, setDrawingMode] = useState(false)

  const path = (status, fn) => {
    setState(status)
    setBoard(clearVisited(board))
    fn(start, target, board, setBoard, setState)
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
    if (state) return;
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
      if (state == 1) path(Search.BFS, bfs)
      if (state == 2) path(Search.ASTAR, astar)
      if (state == 3) path(Search.DFS, dfs)
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
    if (state == 1) path(Search.BFS, bfs)
    if (state == 2) path(Search.ASTAR, astar)
    if (state == 3) path(Search.DFS, dfs)
    return
  }

  return (
    <>
      <div className="options">
        <button 
          className='search' 
          onClick={() => path(Search.BFS, bfs)} 
          disabled={!start || !target || state}
        >
          BFS
        </button>
        <button 
          className='search' 
          onClick={() => path(Search.ASTAR, astar)} 
          disabled={!start || !target || state}
        >
          A*
        </button>
        <button 
          className='search' 
          onClick={() => path(Search.DFS, dfs)} 
          disabled={!start || !target || state}
        >
          DFS
        </button>
        <button className='clear' disabled={state} onClick={clearBoard}>Clear</button>
        <button className='walls' disabled={state} onClick={() => setDrawingMode(!isDrawing)}>{isDrawing ? "Stop Drawing" : "Draw Walls"}</button>
        <button className='walls' disabled={state} onClick={generateMaze}>Create Maze</button>
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
      { !start && !target && <p className="options instructions"><i><strong>Click a cell to select the starting point</strong></i></p>}
      { start && !target && <p className="options instructions"><i><strong>Click a cell to select the finish point</strong></i></p>}
      { start && target && <p className="options instructions"><i><strong>Choose a search algorithm</strong></i></p>}
    </>
  )
}

export default Board
