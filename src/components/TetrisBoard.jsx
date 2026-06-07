import TetrisCell from './TetrisCell'
import { BOARD_COLS, BOARD_ROWS } from '../utils/tetrisUtils'

export default function TetrisBoard({ board, current, ghost }) {
  // Build display grid as flat array of { imgIndex, isGhost }
  const cells = Array.from({ length: BOARD_ROWS * BOARD_COLS }, (_, i) => {
    const r = Math.floor(i / BOARD_COLS)
    const c = i % BOARD_COLS
    return { imgIndex: board[r][c] ?? null, isGhost: false }
  })

  const overlay = (piece, isGhost) => {
    if (!piece) return
    piece.matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return
        const br = piece.pos.y + r
        const bc = piece.pos.x + c
        if (br < 0 || br >= BOARD_ROWS || bc < 0 || bc >= BOARD_COLS) return
        const idx = br * BOARD_COLS + bc
        if (!isGhost || !cells[idx].imgIndex) {
          cells[idx] = { imgIndex: cell, isGhost }
        }
      })
    })
  }

  overlay(ghost, true)
  overlay(current, false)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
      gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.85)',
      border: '2px solid rgba(0,212,255,0.5)',
      boxShadow: '0 0 30px rgba(0,212,255,0.25), inset 0 0 40px rgba(0,0,0,0.6)',
    }}>
      {cells.map((cell, i) => (
        <TetrisCell key={i} imgIndex={cell.imgIndex} isGhost={cell.isGhost} />
      ))}
    </div>
  )
}
