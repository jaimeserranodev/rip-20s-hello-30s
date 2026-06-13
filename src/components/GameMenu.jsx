import { useState, useEffect } from 'react'
import { getProgress } from '../utils/storage'

const B = import.meta.env.BASE_URL

const GAMES = [
  {
    id: 'tetris',
    emoji: '🟦',
    title: 'DANI-TRIS',
    subtitle: 'Tetris del cumple',
    description: 'Encaja a Dani antes de que lleguen los 30. Llega a 30 líneas.',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
    glow: '#00d4ff',
    progressKey: 'danitrisCompleted',
    cover: `${B}portadas/danitris.png`,
  },
  {
    id: 'novel',
    emoji: '🕵️',
    title: 'El Lobo de la Isla',
    subtitle: 'Novela gráfica noir',
    description: 'Un crimen. Un detective. Siete sospechosos. Encuentra al lobo antes de que el pueblo lo condene.',
    gradient: 'linear-gradient(135deg, #c8a96e 0%, #5c4a2a 100%)',
    glow: '#c8a96e',
    progressKey: 'novelCompleted',
    cover: `${B}portadas/wolflanzarote.png`,
  },
  {
    id: 'memory',
    emoji: '🃏',
    title: 'Encuentra las Parejas',
    subtitle: 'Memory de cartas',
    description: 'Demuestra tu memoria encontrando todas las parejas.',
    gradient: 'linear-gradient(135deg, #ff2d78 0%, #8b5cf6 100%)',
    glow: '#ff2d78',
    progressKey: 'memoryCompleted',
    cover: `${B}portadas/cartas.png`,
  },
]

function GameCard({ game, progress, onPlay, index }) {
  const isCompleted = progress[game.progressKey]
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 0.12}s`, animationFillMode: 'both' }}
    >
      <button
        onClick={() => onPlay(game.id)}
        className="relative w-full text-left rounded-3xl overflow-hidden"
        style={{
          cursor: 'pointer',
          border: 'none',
          padding: 0,
          background: 'transparent',
          transform: 'translateY(0)',
          transition: 'transform 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
        aria-label={`Jugar ${game.title}`}
      >
        <div
          style={{
            background: game.gradient,
            padding: '2px',
            borderRadius: '1.5rem',
            boxShadow: `0 8px 40px ${game.glow}44`,
          }}
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(10,10,20,0.82)', display: 'flex', flexDirection: 'column' }}
          >
            {/* Portada */}
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', flexShrink: 0 }}>
              {!imgError ? (
                <img
                  src={game.cover}
                  alt=""
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/7', background: game.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3.5rem', filter: `drop-shadow(0 0 16px ${game.glow})` }}>{game.emoji}</span>
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 55%)' }} />
              {isCompleted && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body font-black"
                  style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(57,255,20,0.25)',
                    border: '1px solid #39ff1488',
                    color: '#39ff14',
                  }}
                >
                  ✓ Completado
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p
                className="font-body font-bold text-xs m-0"
                style={{ color: game.glow, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              >
                {game.subtitle}
              </p>
              <h2
                className="font-arcade m-0 leading-tight"
                style={{ fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', color: 'white', textShadow: `0 0 20px ${game.glow}66` }}
              >
                {game.title}
              </h2>
              <p className="font-body text-sm m-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {game.description}
              </p>
              <div style={{ marginTop: '8px' }}>
                <span
                  className="inline-block font-body font-black text-sm px-4 py-2 rounded-xl"
                  style={{ background: game.gradient, color: '#08080f' }}
                >
                  {isCompleted ? '🔄 Volver a jugar' : '▶ Jugar ahora'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

export default function GameMenu({ onNavigate }) {
  const [progress, setProgress] = useState(getProgress())

  useEffect(() => { setProgress(getProgress()) }, [])

  const completedCount = GAMES.filter(g => progress[g.progressKey]).length

  return (
    <div
      className="min-h-dvh w-full px-4 py-8 md:py-12"
      style={{ background: 'linear-gradient(180deg, #08080f 0%, #12121e 100%)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <p
            className="font-body font-bold text-xs mb-2 uppercase tracking-widest"
            style={{ color: '#8b5cf6' }}
          >
            🎮 Arcade de Cumpleaños
          </p>
          <h1
            className="font-arcade m-0"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 4rem)', color: '#ff2d78', textShadow: '0 0 30px #ff2d78aa' }}
          >
            El Multiverso de Dani
          </h1>
          <p className="font-body text-base md:text-lg mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {completedCount === 3
              ? '⭐ ¡Has completado todos los juegos!'
              : `${completedCount} de ${GAMES.length} completados`}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} progress={progress} onPlay={onNavigate} index={i} />
          ))}
        </div>

        <p className="text-center font-body text-xs mt-10 animate-fade-in" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Hecho con amor para los 30 de Dani 🎂
        </p>
      </div>
    </div>
  )
}
