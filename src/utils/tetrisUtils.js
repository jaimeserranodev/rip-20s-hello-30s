export const BOARD_COLS = 10
export const BOARD_ROWS = 20

export function createEmptyBoard() {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null))
}

// Clockwise 90° rotation
export function rotateCW(matrix) {
  const R = matrix.length
  const C = matrix[0].length
  return Array.from({ length: C }, (_, c) =>
    Array.from({ length: R }, (_, r) => matrix[R - 1 - r][c])
  )
}

export function isValid(board, matrix, pos) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue
      const br = pos.y + r
      const bc = pos.x + c
      if (bc < 0 || bc >= BOARD_COLS || br >= BOARD_ROWS) return false
      if (br >= 0 && board[br][bc] !== null) return false
    }
  }
  return true
}

export function placePiece(board, matrix, pos) {
  const b = board.map(row => [...row])
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue
      const br = pos.y + r
      const bc = pos.x + c
      if (br >= 0 && br < BOARD_ROWS && bc >= 0 && bc < BOARD_COLS) {
        b[br][bc] = matrix[r][c]
      }
    }
  }
  return b
}

export function clearLines(board) {
  const kept = board.filter(row => row.some(cell => cell === null))
  const cleared = BOARD_ROWS - kept.length
  const empty = Array.from({ length: cleared }, () => Array(BOARD_COLS).fill(null))
  return { board: [...empty, ...kept], cleared }
}

export function spawnX(matrix) {
  return Math.floor((BOARD_COLS - matrix[0].length) / 2)
}

export function calcScore(lines, level) {
  return ([0, 100, 300, 500, 800][lines] ?? 0) * (level + 1)
}
