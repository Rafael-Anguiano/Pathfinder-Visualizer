import { Status } from "../constants"
import "../styles/tile.css"

const Tile = ({ status, position, handleClick, handleHolding, isHolding }) => {
  return (
    <div
      className={(
        status == Status.UNVISITED ? "unvisited" :
          status == Status.VISITED ? "visited" :
            status == Status.START ? "start" :
              status == Status.TARGET ? "target" :
                status == Status.WALL ? "wall" :
                  "path"
      ) + " tile"}
      onMouseDown={() => handleHolding(true, position.i, position.j)}
      onMouseEnter={() => isHolding && handleClick(position.i, position.j)}
      onMouseUp={() => handleHolding(false)}
    />
  )
}

export default Tile
