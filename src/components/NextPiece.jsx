import { getImageSrc } from '../data/tetrisPieces'

const PREVIEW = 4

export default function NextPiece({ piece }) {
  if (!piece) return <div style={{ width: '100%', aspectRatio: '1' }} />

  const rows = piece.matrix.length
  const cols = piece.matrix[0].length
  const grid = Array.from({ length: PREVIEW }, () => Array(PREVIEW).fill(null))
  const offR = Math.floor((PREVIEW - rows) / 2)
  const offC = Math.floor((PREVIEW - cols) / 2)

  piece.matrix.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell && r + offR < PREVIEW && c + offC < PREVIEW) {
        grid[r + offR][c + offC] = cell
      }
    })
  })

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${PREVIEW}, 1fr)`,
      gridTemplateRows: `repeat(${PREVIEW}, 1fr)`,
      width: '100%',
      aspectRatio: '1',
      gap: '1px',
    }}>
      {grid.flat().map((cell, i) => (
        <div
          key={i}
          style={{
            width: '100%', height: '100%',
            background: cell ? 'transparent' : 'rgba(0,0,0,0.2)',
            borderRadius: '1px',
          }}
        >
          {cell && (
            <img
              src={getImageSrc(cell)}
              alt=""
              draggable="false"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.style.background = `hsl(${cell * 23 % 360}, 70%, 45%)`
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
