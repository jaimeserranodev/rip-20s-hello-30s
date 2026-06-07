import { useState, useEffect } from 'react'
import { getProgress } from '../utils/storage'

const GAMES = [
  {
    id: 'tactics',
    emoji: '⚔️',
    title: 'Birthday Tactics',
    subtitle: 'TFT del cumple',
    description: 'Forma tu equipo de amigos y mascotas. Derrota a Los 30.',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    glow: '#ffd700',
    progressKey: null,
    alwaysUnlocked: true,
  },
  {
    id: 'tetris',
    emoji: '🟦',
    title: 'DANI-TRIS',
    subtitle: 'Tetris del cumple',
    description: 'Encaja a Dani antes de que lleguen los 30. Llega a 30 líneas.',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
    glow: '#00d4ff',
    progressKey: 'danitrisCompleted',
    alwaysUnlocked: true,
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
  },
  {
    id: 'quiz',
    emoji: '🧠',
    title: 'Quiz de Dani',
    subtitle: '¿Cuánto le conoces?',
    description: 'Responde preguntas sobre el protagonista del día.',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0066aa 100%)',
    glow: '#00d4ff',
    progressKey: 'quizCompleted',
  },
  {
    id: 'roulette',
    emoji: '🎡',
    title: 'Ruleta de Retos',
    subtitle: 'Gira y atrévete',
    description: 'La ruleta decide tu reto. No hay escapatoria.',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    glow: '#ffd700',
    progressKey: 'rouletteCompleted',
  },
  {
    id: 'boss',
    emoji: '👹',
    title: 'Boss Final',
    subtitle: 'Los 30 te llaman',
    description: 'El jefe final espera. ¿Estás listo para los 30?',
    gradient: 'linear-gradient(135deg, #39ff14 0%, #00aa44 100%)',
    glow: '#39ff14',
    progressKey: null,
    locked: true,
  },
]

function GameCard({ game, progress, onPlay, index }) {
  const isCompleted = progress[game.progressKey]
  const isBoss = game.id === 'boss'
  const allDone = progress.memoryCompleted && progress.quizCompleted && progress.rouletteCompleted
  const isLocked = isBoss && !allDone

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      <button
        onClick={() => !isLocked && onPlay(game.id)}
        disabled={isLocked}
        className="relative w-full text-left rounded-3xl overflow-hidden transition-all duration-300"
        style={{
          cursor: isLocked ? 'not-allowed' : 'pointer',
          border: 'none',
          padding: 0,
          background: 'transparent',
          transform: 'translateY(0)',
        }}
        onMouseEnter={e => {
          if (!isLocked) e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
        }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
        aria-label={`Jugar ${game.title}${isLocked ? ' (bloqueado)' : ''}`}
      >
        {/* Fondo del card */}
        <div
          style={{
            background: isLocked
              ? 'linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 100%)'
              : game.gradient,
            padding: '2px',
            borderRadius: '1.5rem',
            boxShadow: isLocked
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : `0 8px 40px ${game.glow}44`,
            transition: 'box-shadow 0.3s',
          }}
        >
          <div
            className="glass rounded-3xl p-5 md:p-6"
            style={{
              background: isLocked
                ? 'rgba(10,10,20,0.95)'
                : 'rgba(10,10,20,0.8)',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Emoji e indicadores */}
            <div className="flex items-start justify-between">
              <span
                style={{
                  fontSize: '3rem',
                  filter: isLocked
                    ? 'grayscale(1) opacity(0.4)'
                    : `drop-shadow(0 0 12px ${game.glow})`,
                  transition: 'filter 0.3s',
                }}
              >
                {game.emoji}
              </span>

              <div className="flex flex-col items-end gap-1">
                {isCompleted && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body font-black"
                    style={{
                      background: 'rgba(57,255,20,0.2)',
                      border: '1px solid #39ff1488',
                      color: '#39ff14',
                    }}
                  >
                    ✓ Completado
                  </span>
                )}
                {isLocked && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body font-bold"
                    style={{
                      background: 'rgba(255,215,0,0.15)',
                      border: '1px solid rgba(255,215,0,0.3)',
                      color: '#ffd700',
                    }}
                  >
                    🔒 Bloqueado
                  </span>
                )}
              </div>
            </div>

            {/* Texto */}
            <div>
              <p
                className="font-body font-bold text-xs mb-1"
                style={{ color: isLocked ? 'rgba(255,255,255,0.3)' : game.glow, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              >
                {game.subtitle}
              </p>
              <h2
                className="font-arcade m-0 leading-tight"
                style={{
                  fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                  color: isLocked ? 'rgba(255,255,255,0.3)' : 'white',
                  textShadow: isLocked ? 'none' : `0 0 20px ${game.glow}66`,
                }}
              >
                {game.title}
              </h2>
              <p
                className="font-body text-sm mt-1"
                style={{ color: isLocked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)' }}
              >
                {isLocked
                  ? 'Completa los 3 minijuegos para desbloquear'
                  : game.description}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <span
                className="inline-block font-body font-black text-sm px-4 py-2 rounded-xl"
                style={{
                  background: isLocked
                    ? 'rgba(255,255,255,0.05)'
                    : game.gradient,
                  color: isLocked ? 'rgba(255,255,255,0.2)' : '#08080f',
                  transition: 'all 0.2s',
                }}
              >
                {isLocked ? '🔒 Bloqueado' : isCompleted ? '🔄 Volver a jugar' : '▶ Jugar ahora'}
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

export default function GameMenu({ onNavigate }) {
  const [progress, setProgress] = useState(getProgress())

  // Refresca el progreso cada vez que se monta el menú
  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const allDone = progress.memoryCompleted && progress.quizCompleted && progress.rouletteCompleted
  const completedCount = [progress.memoryCompleted, progress.quizCompleted, progress.rouletteCompleted].filter(Boolean).length

  return (
    <div
      className="min-h-dvh w-full px-4 py-8 md:py-12"
      style={{ background: 'linear-gradient(180deg, #08080f 0%, #12121e 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 animate-slide-up">
          <p
            className="font-body font-bold text-xs mb-2 uppercase tracking-widest"
            style={{ color: '#8b5cf6' }}
          >
            🎮 Arcade de Cumpleaños
          </p>
          <h1
            className="font-arcade m-0"
            style={{
              fontSize: 'clamp(2.2rem, 8vw, 4rem)',
              color: '#ff2d78',
              textShadow: '0 0 30px #ff2d78aa',
            }}
          >
            El Multiverso de Dani
          </h1>
          <p
            className="font-body text-base md:text-lg mt-3"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Completa los 3 minijuegos para desbloquear el Boss Final
          </p>
        </div>

        {/* Barra de progreso */}
        <div
          className="glass rounded-2xl p-4 mb-8 animate-slide-up delay-100"
          style={{ animationFillMode: 'both' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-body font-bold text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Progreso
            </span>
            <span className="font-arcade text-lg" style={{ color: '#ffd700' }}>
              {completedCount} / 3
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
          {allDone && (
            <p
              className="font-body font-black text-sm text-center mt-2 animate-bounce-in"
              style={{ color: '#39ff14', textShadow: '0 0 10px #39ff14' }}
            >
              ⚡ ¡Boss Final desbloqueado! ¡A por él!
            </p>
          )}
        </div>

        {/* Grid de juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {GAMES.map((game, i) => (
            <GameCard
              key={game.id}
              game={game}
              progress={progress}
              onPlay={onNavigate}
              index={i}
            />
          ))}
        </div>

        {/* Footer */}
        <p
          className="text-center font-body text-xs mt-8 animate-fade-in"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          Hecho con amor para los 30 de Dani 🎂
        </p>
      </div>
    </div>
  )
}
