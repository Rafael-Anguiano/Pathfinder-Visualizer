import { useState } from 'react'
import { clearEntireBoard, clearVisited, copyBoard, getDistance } from '../helpers/helpers.js';
import { di, dj, base, Status, Search } from '../constants.js'
import Tile from './Tile';

const Board = () => {
  const [board, setBoard] = useState(base)
  const [state, setState] = useState(Search.NONE)
  const [target, setTarget] = useState()
  const [start, setStarting] = useState()
  const [holdingMouse, setHolding] = useState(false)
  const [isDrawing, setDrawingMode] = useState(false)

  const astar = () => {
    setState(Search.ASTAR)
    let newBoard = clearVisited(board);
    let visited = new Set();
    let found = false
    const q = [{ i: start.i, j: start.j, q: 0, h: getDistance(start, target) }]

    while (q.length) {
      const curr = q[0];
      q.shift();
      if (visited.has(newBoard[curr.i][curr.j].id)) continue;
      if (!(curr.i == start.i && curr.j == start.j)) {
        if (!(curr.i == target.i && curr.j == target.j)) newBoard[curr.i][curr.j].status = Status.VISITED;
        newBoard[curr.i][curr.j].setPrev(curr.prev.i, curr.prev.j)
      }
      if (curr.i == target.i && curr.j == target.j) {
        found = true;
        break;
      }

      visited.add(newBoard[curr.i][curr.j].id)
      setBoard(newBoard)

      for (let i = 0; i < 4; i++) {
        if (di[i] + curr.i < 0 || di[i] + curr.i >= newBoard.length) continue;
        if (dj[i] + curr.j < 0 || dj[i] + curr.j >= newBoard[0].length) continue;
        if (visited.has(newBoard[di[i] + curr.i][dj[i] + curr.j].id)) continue;
        if (newBoard[di[i] + curr.i][dj[i] + curr.j].status == Status.WALL) continue;

        q.push({ i: di[i] + curr.i, j: dj[i] + curr.j, prev: { i: curr.i, j: curr.j }, g: getDistance(curr, start), h: getDistance(curr, target) })
        q.sort((a, b) => {
          if (a.g + a.h != b.g + b.h) return (a.g + a.h) - (b.g + b.h)
          return a.h - b.h
        })
      }
    }

    if (found) {
      let curr = newBoard[target.i][target.j]
      while (curr.id != newBoard[start.i][start.j].id) {
        if (!(curr.prev.i == start.i && curr.prev.j == start.j)) newBoard[curr.prev.i][curr.prev.j].status = Status.PATH
        let prev = curr.getPath()
        curr = newBoard[prev.i][prev.j]
        setBoard(newBoard)
      }
    }
  }

  const bfs = () => {
    setState(Search.BFS)
    let found = false
    const visited = new Set();
    let newBoard = clearVisited(board)
    const q = [{ i: start.i, j: start.j, q: 0, h: getDistance(start, target) }]

    while (q.length) {
      const curr = q[0];
      q.shift();
      if (visited.has(newBoard[curr.i][curr.j].id)) continue;
      if (!(curr.i == start.i && curr.j == start.j)) {
        if (!(curr.i == target.i && curr.j == target.j)) newBoard[curr.i][curr.j].status = Status.VISITED;
        newBoard[curr.i][curr.j].setPrev(curr.prev.i, curr.prev.j)
      }
      if (curr.i == target.i && curr.j == target.j) {
        found = true;
        break;
      }
      visited.add(newBoard[curr.i][curr.j].id)
      setBoard(newBoard)

      for (let i = 0; i < 4; i++) {
        if (di[i] + curr.i < 0 || di[i] + curr.i >= newBoard.length) continue;
        if (dj[i] + curr.j < 0 || dj[i] + curr.j >= newBoard[0].length) continue;
        if (visited.has(newBoard[di[i] + curr.i][dj[i] + curr.j])) continue;
        if (newBoard[di[i] + curr.i][dj[i] + curr.j].status == Status.WALL) continue;

        q.push({ i: di[i] + curr.i, j: dj[i] + curr.j, prev: { i: curr.i, j: curr.j }, g: getDistance(curr, start), h: getDistance(curr, target) })
      }
    }
    if (found) {
      let curr = newBoard[target.i][target.j]
      while (curr.id != newBoard[start.i][start.j].id) {
        if (!(curr.prev.i == start.i && curr.prev.j == start.j)) newBoard[curr.prev.i][curr.prev.j].status = Status.PATH
        let prev = curr.getPath()
        curr = newBoard[prev.i][prev.j]
        setBoard(newBoard)
      }
    }
  }

  const clearBoard = () => {
    setBoard(clearEntireBoard(board))
    setStarting(undefined)
    setTarget(undefined)
    setState(0)
    setHolding(false)
    setDrawingMode(false)
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
        <button className='search' onClick={() => bfs()} disabled={!target || !target}>BFS</button>
        <button className='search' onClick={() => astar()} disabled={!target || !target}>A*</button>
        <button className='clear' onClick={() => clearBoard()}>Clear</button>
        <button className='walls' onClick={() => setDrawingMode(!isDrawing)}>{isDrawing ? "Stop Drawing" : "Draw Walls"}</button>
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


// backgroundGradient={'linear-gradient(90deg, #e66465, #9198e5)'}
