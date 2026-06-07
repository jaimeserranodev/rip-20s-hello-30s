const B = import.meta.env.BASE_URL

// Image indices map to public/tetris/{n}.png
// Each piece uses 4 images; 0 = empty cell
export const PIECE_DEFS = {
  O: { id: 'O', matrix: [[1,2],[3,4]] },
  I: { id: 'I', matrix: [[5],[6],[7],[8]] },
  T: { id: 'T', matrix: [[0,9,0],[11,10,12]] },
  L: { id: 'L', matrix: [[13,0],[14,0],[15,16]] },
  J: { id: 'J', matrix: [[0,17],[0,18],[20,19]] },
  S: { id: 'S', matrix: [[0,22,21],[24,23,0]] },
  Z: { id: 'Z', matrix: [[25,26,0],[0,27,28]] },
}

export const PIECE_TYPES = Object.keys(PIECE_DEFS)

export function getImageSrc(imgIndex) {
  if (!imgIndex) return null
  return `${B}tetris/${imgIndex}.png`
}
