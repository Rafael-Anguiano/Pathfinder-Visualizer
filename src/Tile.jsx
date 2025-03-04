import "./tile.css"

const Tile = ({ status, position, backgroundGradient, handleClick }) => {
  return (
    <div
      className={(
        status == 0 ? "unvisited" :
          status == 1 ? "visited" :
            status == 2 ? "start" :
              status == 3 ? "target" :
                status == 4 ? "wall" :
                  "path"
      ) + " tile"}
      onClick={() => handleClick(position.i, position.j)}
    ></div>
  )
}

export default Tile
// style={status == 1 ? { background: backgroundGradient } : null}
