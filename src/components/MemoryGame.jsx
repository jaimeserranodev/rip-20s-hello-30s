import { useState, useEffect, useCallback, useRef } from 'react'
import { cards, BACK_CARD } from '../data/cards'
import { markCompleted } from '../utils/storage'
import Confetti from './Confetti'
import Layout from './Layout'

/**
 * Mezcla un array con Fisher-Yates shuffle.
 */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Genera el tablero: duplica las 12 cartas y las mezcla.
 * Cada carta tiene un uid único para distinguir los dos gemelos.
 */
function buildDeck() {
  const pairs = cards.flatMap(card => [
    { ...card, uid: `${card.id}-a` },
    { ...card, uid: `${card.id}-b` },
  ])
  return shuffle(pairs)
}

/** Formatea segundos como MM:SS */
function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

/** Carta individual del tablero */
function MemoryCard({ card, isFlipped, isMatched, onClick }) {
  return (
    <div
      className="card-scene"
      style={{ aspectRatio: '2/3', minHeight: 0 }}
      onClick={onClick}
      role="button"
      aria-label={isFlipped || isMatched ? card.label : 'Carta boca abajo'}
      aria-pressed={isFlipped || isMatched}
    >
      <div className={`card-inner ${isFlipped || isMatched ? 'flipped' : ''}`}>
        {/* Cara trasera (lo que se ve cuando está boca abajo) */}
        <div
          className="card-cover"
          style={{
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            border: '2px solid rgba(139,92,246,0.4)',
          }}
        >
          <img
            src={BACK_CARD}
            alt=""
            aria-hidden="true"
            draggable="false"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentElement.style.background = 'linear-gradient(135deg, #8b5cf6, #ff2d78)'
            }}
          />
        </div>
        {/* Cara delantera (la imagen de la carta) */}
        <div
          className="card-face"
          style={{
            border: isMatched
              ? '2px solid #39ff14'
              : '2px solid rgba(0,212,255,0.4)',
            boxShadow: isMatched
              ? '0 0 16px #39ff1488, 0 4px 16px rgba(0,0,0,0.5)'
              : '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src={card.image}
            alt={card.label}
            draggable="false"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => {
              // Placeholder si la imagen no existe aún
              e.target.style.display = 'none'
              const p = e.target.parentElement
              p.style.background = `hsl(${(card.id * 30) % 360}, 70%, 30%)`
              p.style.display = 'flex'
              p.style.alignItems = 'center'
              p.style.justifyContent = 'center'
              p.innerHTML = `<span style="font-size:2rem;opacity:0.5">${card.id}</span>`
            }}
          />
        </div>
      </div>
    </div>
  )
}

/** Pantalla de victoria */
function VictoryScreen({ moves, time, onReplay, onBack }) {
  useEffect(() => {
    markCompleted('memory')
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4 text-center"
      style={{ background: 'rgba(8,8,15,0.95)' }}
    >
      <Confetti />
      <div
        className="glass-strong rounded-3xl p-8 md:p-12 max-w-lg w-full animate-bounce-in"
        style={{ border: '2px solid rgba(57,255,20,0.4)', position: 'relative', zIndex: 1 }}
      >
        <div
          className="font-arcade animate-victory"
          style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', color: '#39ff14', textShadow: '0 0 40px #39ff14' }}
        >
          🎉
        </div>
        <h2
          className="font-arcade mt-2 mb-4"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', color: '#39ff14', textShadow: '0 0 20px #39ff1488' }}
        >
          ¡Felicidades!
        </h2>
        <p
          className="font-body text-base md:text-lg font-semibold mb-6"
          style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}
        >
          Has sobrevivido a los 20 de Dani.
          <br />
          <span style={{ color: '#ffd700', fontSize: '1.1em' }}>Bienvenido a los 30.</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className="glass rounded-2xl p-4"
            style={{ border: '1px solid rgba(255,215,0,0.3)' }}
          >
            <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Tiempo final</p>
            <p className="font-arcade text-2xl" style={{ color: '#ffd700' }}>{formatTime(time)}</p>
          </div>
          <div
            className="glass rounded-2xl p-4"
            style={{ border: '1px solid rgba(0,212,255,0.3)' }}
          >
            <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Movimientos</p>
            <p className="font-arcade text-2xl" style={{ color: '#00d4ff' }}>{moves}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="btn-arcade btn-green rounded-2xl py-3 text-lg font-body font-black"
            onClick={onReplay}
          >
            🔄 Volver a jugar
          </button>
          <button
            className="btn-arcade btn-ghost rounded-2xl py-3 text-base font-body font-bold"
            onClick={onBack}
          >
            ← Volver al menú
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MemoryGame({ onBack }) {
  const [deck, setDeck] = useState(() => buildDeck())
  const [flipped, setFlipped] = useState([])         // índices de cartas volteadas
  const [matched, setMatched] = useState(new Set())   // UIDs de cartas emparejadas
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [canFlip, setCanFlip] = useState(true)
  const timerRef = useRef(null)

  const totalPairs = deck.length / 2

  // Temporizador
  useEffect(() => {
    if (!gameOver) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameOver])

  const resetGame = useCallback(() => {
    setDeck(buildDeck())
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setTime(0)
    setGameOver(false)
    setCanFlip(true)
    clearInterval(timerRef.current)
  }, [])

  const handleCardClick = useCallback((index) => {
    if (!canFlip) return
    if (flipped.includes(index)) return
    if (matched.has(deck[index].uid)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setCanFlip(false)

      const [a, b] = newFlipped
      const cardA = deck[a]
      const cardB = deck[b]

      if (cardA.id === cardB.id) {
        // Pareja encontrada
        const newMatched = new Set(matched)
        newMatched.add(cardA.uid)
        newMatched.add(cardB.uid)
        setMatched(newMatched)
        setFlipped([])
        setCanFlip(true)

        if (newMatched.size / 2 === totalPairs) {
          clearInterval(timerRef.current)
          setTimeout(() => setGameOver(true), 600)
        }
      } else {
        // No coinciden: volver a tapar
        setTimeout(() => {
          setFlipped([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }, [canFlip, flipped, matched, deck, totalPairs])

  const matchedPairs = matched.size / 2
  const pct = Math.round((matchedPairs / totalPairs) * 100)

  return (
    <Layout title="🃏 Memory" onBack={onBack}>
      {gameOver && (
        <VictoryScreen
          moves={moves}
          time={time}
          onReplay={resetGame}
          onBack={onBack}
        />
      )}

      {/* Stats bar */}
      <div
        className="sticky top-[57px] z-30 px-3 py-2"
        style={{
          background: 'rgba(8,8,15,0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(139,92,246,0.15)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-2 md:gap-4">
          {[
            { label: '⏱', value: formatTime(time), color: '#00d4ff' },
            { label: '🖱️', value: `${moves}`, color: '#ff2d78' },
            { label: '💎', value: `${matchedPairs}/${totalPairs}`, color: '#39ff14' },
            { label: '%', value: `${pct}%`, color: '#ffd700' },
          ].map(stat => (
            <div
              key={stat.label}
              className="glass rounded-xl px-3 py-1 flex items-center gap-1"
            >
              <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</span>
              <span className="font-arcade text-base" style={{ color: stat.color }}>{stat.value}</span>
            </div>
          ))}
          <button
            className="btn-arcade btn-ghost rounded-xl px-3 py-1 text-sm font-body font-bold ml-auto"
            onClick={resetGame}
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Progress bar */}
        <div className="max-w-5xl mx-auto mt-2 progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Tablero de cartas: 3 cols mobile / 4 tablet / 6 desktop */}
      <div className="px-2 py-4 md:p-6">
        <div
          className="memory-board max-w-5xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(var(--cols, 3), 1fr)',
            gap: '8px',
          }}
        >
          <style>{`
            .memory-board { --cols: 3; }
            @media (min-width: 600px)  { .memory-board { --cols: 4; gap: 10px; } }
            @media (min-width: 1024px) { .memory-board { --cols: 6; gap: 12px; } }
          `}</style>
          {deck.map((card, i) => (
            <MemoryCard
              key={card.uid}
              card={card}
              isFlipped={flipped.includes(i)}
              isMatched={matched.has(card.uid)}
              onClick={() => handleCardClick(i)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
