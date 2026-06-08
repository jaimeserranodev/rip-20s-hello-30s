/**
 * Utilidades de localStorage para guardar progreso de los minijuegos.
 * Claves: memoryCompleted | quizCompleted | rouletteCompleted
 */

const KEYS = {
  memory:   'memoryCompleted',
  quiz:     'quizCompleted',
  roulette: 'rouletteCompleted',
}

export function getProgress() {
  return {
    memoryCompleted:   localStorage.getItem(KEYS.memory)   === 'true',
    quizCompleted:     localStorage.getItem(KEYS.quiz)     === 'true',
    rouletteCompleted: localStorage.getItem(KEYS.roulette) === 'true',
    danitrisCompleted: localStorage.getItem('danitrisCompleted') === 'true',
    novelCompleted:    localStorage.getItem('novelCompleted')    === 'true',
  }
}

export function markCompleted(game) {
  if (KEYS[game]) {
    localStorage.setItem(KEYS[game], 'true')
  }
}

export function isAllCompleted() {
  const p = getProgress()
  return p.memoryCompleted && p.quizCompleted && p.rouletteCompleted
}

export function resetProgress() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
