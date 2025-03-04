import { useState } from 'react'
import { clearEntireBoard, clearVisited, copyBoard } from './helpers';
import { di, dj, base, Status, Movement } from './constants.js'
import Tile from './Tile';

const Board = () => {
  const [matrix, setMatrix] = useState(base)
  const [start, setStarting] = useState()
  const [target, setTarget] = useState()
  const [isDrawing, setDrawingMode] = useState(false)
  const [state, setState] = useState(false)
  // const [drag, setDrag] = useState(Movement.NOTHING)

  const bfs = () => {
    setState(true)
    let newMatrix = clearVisited(matrix)
    let visited = new Set();
    let q = [{ i: start.i, j: start.j }]
    let found = false

    while (q.length != 0) {
      const curr = q[0];
      q.shift();
      if (visited.has(newMatrix[curr.i][curr.j].id)) continue;
      if (!(curr.i == start.i && curr.j == start.j)) {
        if (!(curr.i == target.i && curr.j == target.j)) newMatrix[curr.i][curr.j].status = Status.VISITED;
        newMatrix[curr.i][curr.j].setPrev(curr.prev.i, curr.prev.j)
      }
      if (curr.i == target.i && curr.j == target.j) {
        found = true;
        break;
      }
      visited.add(newMatrix[curr.i][curr.j].id)
      setMatrix(newMatrix)

      for (let i = 0; i < 4; i++) {
        if (di[i] + curr.i < 0 || di[i] + curr.i >= newMatrix.length) continue;
        if (dj[i] + curr.j < 0 || dj[i] + curr.j >= newMatrix[0].length) continue;
        if (visited.has(newMatrix[di[i] + curr.i][dj[i] + curr.j])) continue;
        if (newMatrix[di[i] + curr.i][dj[i] + curr.j].status == Status.WALL) continue;

        q.push({ i: di[i] + curr.i, j: dj[i] + curr.j, prev: { i: curr.i, j: curr.j } })
      }
    }
    if (found) {
      let curr = newMatrix[target.i][target.j]
      while (curr.id != newMatrix[start.i][start.j].id) {
        if (!(curr.prev.i == start.i && curr.prev.j == start.j)) newMatrix[curr.prev.i][curr.prev.j].status = Status.PATH
        let prev = curr.getPath()
        curr = newMatrix[prev.i][prev.j]
        setMatrix(newMatrix)
      }
    }
  }

  const clearBoard = () => {
    let newMatrix = clearEntireBoard(matrix);
    setMatrix(newMatrix)
    setStarting(undefined)
    setTarget(undefined)
    setState(false)
  }

  const handleClick = (iClicked, jClicked) => {
    let newMatrix = copyBoard(matrix)
    if (isDrawing) {
      if (newMatrix[iClicked][jClicked].status != Status.WALL) newMatrix[iClicked][jClicked].status = Status.WALL
      else newMatrix[iClicked][jClicked].status = Status.UNVISITED
      setMatrix(newMatrix)
      if (iClicked == start.i && jClicked == start.j) {
        setStarting(undefined)
        newMatrix = clearVisited(matrix)
        setMatrix(newMatrix)
      }
      if (iClicked == target.i && jClicked == target.j) {
        setTarget(undefined)
      }
      if (state) bfs()
      return
    }
    if (!start) {
      setStarting({ i: iClicked, j: jClicked })
      newMatrix[iClicked][jClicked].status = Status.START
      setMatrix(newMatrix)
      if (state) bfs()
      return
    }
    if (!target) {
      setTarget({ i: iClicked, j: jClicked })
      newMatrix[iClicked][jClicked].status = Status.TARGET
      setMatrix(newMatrix)
      if (state) bfs()
      return
    }
  }

  return (
    <>
      <div className="options">
        <button className='search' onClick={() => bfs()} disabled={!target || !target}>Search</button>
        <button className='clear' onClick={() => clearBoard()}>Clear</button>
        <button className='walls' onClick={() => setDrawingMode(!isDrawing)}>{isDrawing ? "Stop Drawing" : "Draw Walls"}</button>
      </div>
      <div className="container">
        {
          matrix.map((row, i) => (
            row.map((el, j) => <Tile
              key={el.id}
              status={el.status}
              handleClick={handleClick}
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
