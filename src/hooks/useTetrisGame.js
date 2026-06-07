import { useState, useEffect, useCallback, useRef } from 'react'
import { PIECE_DEFS, PIECE_TYPES } from '../data/tetrisPieces'
import {
  createEmptyBoard, rotateCW, isValid, placePiece,
  clearLines, spawnX, calcScore,
} from '../utils/tetrisUtils'

const LINE_MSGS = [
  'Dani ha sobrevivido otro lunes.',
  'Crisis aplazada.',
  'Otro bloque de adulto superado.',
  'La rodilla todavía aguanta.',
  'Los 30 no pueden contigo.',
]
const SPEEDS = [800, 720, 640, 560, 480, 400, 340, 280, 220, 160, 120]
const VICTORY_LINES = 30

function randomPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]
  return { type, matrix: PIECE_DEFS[type].matrix.map(r => [...r]) }
}

function spawned(piece) {
  return { ...piece, pos: { x: spawnX(piece.matrix), y: -1 } }
}

export default function useTetrisGame() {
  const [board, setBoard]       = useState(createEmptyBoard)
  const [current, setCurrent]   = useState(null)
  const [next, setNext]         = useState(null)
  const [score, setScore]       = useState(0)
  const [lines, setLines]       = useState(0)
  const [level, setLevel]       = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted]   = useState(false)
  const [paused, setPaused]     = useState(false)
  const [victory, setVictory]   = useState(false)
  const [lineMsg, setLineMsg]   = useState('')

  // Sync ref: always reflects latest values for use inside intervals/callbacks
  const g = useRef({
    board: createEmptyBoard(), current: null, next: null,
    paused: false, gameOver: false, level: 0, lines: 0,
  })

  const spawn = useCallback((boardSnap, nextPiece) => {
    const piece = nextPiece ?? randomPiece()
    const sp = spawned(piece)
    if (!isValid(boardSnap, sp.matrix, sp.pos)) {
      g.current.gameOver = true
      setGameOver(true)
      return
    }
    const n = randomPiece()
    g.current.current = sp
    g.current.next = n
    setCurrent(sp)
    setNext(n)
  }, [])

  const lock = useCallback((piece, boardSnap) => {
    const placed = placePiece(boardSnap, piece.matrix, piece.pos)
    const { board: cleared, cleared: count } = clearLines(placed)
    const newLines = g.current.lines + count
    const newLevel = Math.floor(newLines / 10)

    g.current.board = cleared
    g.current.lines = newLines
    g.current.level = newLevel

    setBoard(cleared)
    setScore(s => s + calcScore(count, g.current.level))
    setLines(newLines)
    setLevel(newLevel)

    if (count > 0) {
      setLineMsg(LINE_MSGS[Math.floor(Math.random() * LINE_MSGS.length)])
      setTimeout(() => setLineMsg(''), 2500)
    }
    if (newLines >= VICTORY_LINES) {
      setVictory(true)
      localStorage.setItem('danitrisCompleted', 'true')
    }

    spawn(cleared, g.current.next)
  }, [spawn])

  const autoFall = useCallback(() => {
    const { paused, gameOver, current, board } = g.current
    if (paused || gameOver || !current) return
    const np = { x: current.pos.x, y: current.pos.y + 1 }
    if (isValid(board, current.matrix, np)) {
      const u = { ...current, pos: np }
      g.current.current = u
      setCurrent(u)
    } else {
      lock(current, board)
    }
  }, [lock])

  const autoFallRef = useRef(autoFall)
  useEffect(() => { autoFallRef.current = autoFall }, [autoFall])

  // Game loop
  useEffect(() => {
    if (!started || gameOver || paused) return
    const speed = SPEEDS[Math.min(level, SPEEDS.length - 1)]
    const id = setInterval(() => autoFallRef.current(), speed)
    return () => clearInterval(id)
  }, [started, gameOver, paused, level])

  const startGame = useCallback(() => {
    const empty = createEmptyBoard()
    const first = spawned(randomPiece())
    const second = randomPiece()
    g.current = { board: empty, current: first, next: second, paused: false, gameOver: false, level: 0, lines: 0 }
    setBoard(empty); setCurrent(first); setNext(second)
    setScore(0); setLines(0); setLevel(0)
    setGameOver(false); setVictory(false); setPaused(false)
    setStarted(true); setLineMsg('')
  }, [])

  const move = useCallback((dx) => {
    const { paused, gameOver, current, board } = g.current
    if (paused || gameOver || !current) return
    const np = { x: current.pos.x + dx, y: current.pos.y }
    if (isValid(board, current.matrix, np)) {
      const u = { ...current, pos: np }
      g.current.current = u
      setCurrent(u)
    }
  }, [])

  const rotate = useCallback(() => {
    const { paused, gameOver, current, board } = g.current
    if (paused || gameOver || !current) return
    const rotated = rotateCW(current.matrix)
    for (const kick of [0, -1, 1, -2, 2]) {
      const np = { x: current.pos.x + kick, y: current.pos.y }
      if (isValid(board, rotated, np)) {
        const u = { ...current, matrix: rotated, pos: np }
        g.current.current = u
        setCurrent(u)
        return
      }
    }
  }, [])

  const softDrop = useCallback(() => {
    const { paused, gameOver, current, board } = g.current
    if (paused || gameOver || !current) return
    const np = { x: current.pos.x, y: current.pos.y + 1 }
    if (isValid(board, current.matrix, np)) {
      const u = { ...current, pos: np }
      g.current.current = u
      setCurrent(u)
      setScore(s => s + 1)
    } else {
      lock(current, board)
    }
  }, [lock])

  const hardDrop = useCallback(() => {
    const { paused, gameOver, current, board } = g.current
    if (paused || gameOver || !current) return
    let y = current.pos.y
    while (isValid(board, current.matrix, { x: current.pos.x, y: y + 1 })) y++
    const dropped = { ...current, pos: { x: current.pos.x, y } }
    setScore(s => s + (y - current.pos.y) * 2)
    g.current.current = dropped
    lock(dropped, board)
  }, [lock])

  const togglePause = useCallback(() => {
    setPaused(p => { g.current.paused = !p; return !p })
  }, [])

  // Keyboard input
  useEffect(() => {
    if (!started) return
    const onKey = e => {
      switch (e.code) {
        case 'ArrowLeft':  e.preventDefault(); move(-1); break
        case 'ArrowRight': e.preventDefault(); move(1); break
        case 'ArrowUp':    e.preventDefault(); rotate(); break
        case 'ArrowDown':  e.preventDefault(); softDrop(); break
        case 'Space':      e.preventDefault(); hardDrop(); break
        case 'KeyP':       togglePause(); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, move, rotate, softDrop, hardDrop, togglePause])

  // Ghost piece: furthest valid drop position
  const ghost = current ? (() => {
    let y = current.pos.y
    while (isValid(g.current.board, current.matrix, { x: current.pos.x, y: y + 1 })) y++
    if (y === current.pos.y) return null
    return { ...current, pos: { x: current.pos.x, y } }
  })() : null

  return {
    board, current, next, ghost,
    score, lines, level,
    gameOver, started, paused, victory, lineMsg,
    startGame, move, rotate, softDrop, hardDrop, togglePause,
  }
}
