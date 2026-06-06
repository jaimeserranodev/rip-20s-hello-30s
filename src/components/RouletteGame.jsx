import { useState, useRef } from 'react'
import { challenges } from '../data/challenges'
import { markCompleted } from '../utils/storage'
import Layout from './Layout'
import Confetti from './Confetti'

/* Colores de los segmentos de la ruleta */
const SEGMENT_COLORS = [
  '#ff2d78', '#8b5cf6', '#00d4ff', '#ffd700',
  '#39ff14', '#ff8c00', '#ff4488', '#6366f1',
]

/**
 * Ruleta visual SVG con segmentos de color.
 * Rota mediante CSS animation al girar.
 */
function RouletteWheel({ spinning, rotation }) {
  const count = 8
  const r = 130
  const cx = 150
  const cy = 150
  const angleStep = (2 * Math.PI) / count

  const segments = Array.from({ length: count }, (_, i) => {
    const startAngle = i * angleStep - Math.PI / 2
    const endAngle = startAngle + angleStep
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const midAngle = startAngle + angleStep / 2
    const tx = cx + (r * 0.65) * Math.cos(midAngle)
    const ty = cy + (r * 0.65) * Math.sin(midAngle)
    return { x1, y1, x2, y2, tx, ty, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '300px',
        maxWidth: '90vw',
        aspectRatio: '1',
        margin: '0 auto',
      }}
    >
      {/* Indicador (puntero) */}
      <div
        style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          fontSize: '2rem',
          filter: 'drop-shadow(0 0 8px #ffd700)',
        }}
        aria-hidden="true"
      >
        ▼
      </div>

      {/* Rueda giratoria */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transition: spinning ? 'none' : 'transform 0.1s',
          transform: `rotate(${rotation}deg)`,
          animation: spinning ? `roulette-spin 3s cubic-bezier(0.17,0.67,0.12,1) forwards` : 'none',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.2)',
        }}
      >
        <svg viewBox="0 0 300 300" width="100%" height="100%">
          {segments.map((seg, i) => (
            <g key={i}>
              <path
                d={`M ${cx} ${cy} L ${seg.x1} ${seg.y1} A ${r} ${r} 0 0 1 ${seg.x2} ${seg.y2} Z`}
                fill={seg.color}
                stroke="#08080f"
                strokeWidth="2"
              />
              <text
                x={seg.tx}
                y={seg.ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
                fill="rgba(255,255,255,0.9)"
                style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, userSelect: 'none' }}
              >
                {i + 1}
              </text>
            </g>
          ))}
          {/* Centro */}
          <circle cx={cx} cy={cy} r="20" fill="#08080f" stroke="#8b5cf6" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="8" fill="#ffd700" />
        </svg>
      </div>

      {/* Borde exterior decorativo */}
      <div
        style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: '4px solid rgba(139,92,246,0.5)',
          boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function RouletteGame({ onBack, onComplete }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const spinCount = useRef(0)

  function handleSpin() {
    if (spinning) return
    setResult(null)
    setSpinning(true)

    // Elige reto aleatorio
    const picked = challenges[Math.floor(Math.random() * challenges.length)]
    // Incrementa rotaciones adicionales para que parezca que sigue
    spinCount.current += 1

    setTimeout(() => {
      setSpinning(false)
      setResult(picked)
      setRotation(prev => prev + 1800 + Math.floor(Math.random() * 360))
    }, 3200)
  }

  function handleComplete() {
    markCompleted('roulette')
    setCompleted(true)
    setShowConfetti(true)
  }

  return (
    <Layout title="🎡 Ruleta de Retos" onBack={onBack}>
      {showConfetti && <Confetti />}

      {completed ? (
        /* Pantalla de completado */
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="animate-bounce-in glass-strong rounded-3xl p-8 max-w-md w-full"
            style={{ border: '2px solid rgba(57,255,20,0.4)' }}
          >
            <div style={{ fontSize: '3.5rem' }}>🏆</div>
            <h2 className="font-arcade mt-2 mb-3" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', color: '#39ff14', textShadow: '0 0 20px #39ff14' }}>
              ¡Minijuego completado!
            </h2>
            <p className="font-body text-base mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Eres todo un valiente. Los retos no te dan miedo.
            </p>
            <button className="btn-arcade btn-green rounded-2xl py-3 w-full font-body font-black text-lg" onClick={onBack}>
              ← Volver al menú
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
          {/* Instrucciones */}
          <p
            className="font-body text-center text-base font-semibold animate-slide-up"
            style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '380px' }}
          >
            Gira la ruleta y acepta el reto que te toque. No hay escapatoria.
          </p>

          {/* Ruleta */}
          <div className="animate-scale-in w-full flex justify-center">
            <RouletteWheel spinning={spinning} rotation={rotation} />
          </div>

          {/* Resultado del reto */}
          {result && !spinning && (
            <div
              className="w-full animate-bounce-in glass-strong rounded-3xl p-6 text-center"
              style={{ border: '2px solid rgba(255,215,0,0.4)' }}
            >
              <p
                className="font-body font-bold text-xs uppercase tracking-widest mb-2"
                style={{ color: '#ffd700' }}
              >
                ✨ Tu reto es...
              </p>
              <p
                className="font-body font-black text-xl md:text-2xl"
                style={{ color: 'white', lineHeight: 1.4 }}
              >
                {result}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="w-full flex flex-col gap-3">
            <button
              className="btn-arcade btn-yellow rounded-2xl py-4 font-body font-black text-xl w-full"
              onClick={handleSpin}
              disabled={spinning}
              style={{ opacity: spinning ? 0.7 : 1 }}
            >
              {spinning ? '🌀 Girando...' : result ? '🔄 Girar otra vez' : '🎡 Girar ruleta'}
            </button>

            {result && !spinning && (
              <button
                className="btn-arcade btn-green rounded-2xl py-3 font-body font-black text-lg w-full animate-slide-up"
                onClick={handleComplete}
              >
                ✅ Reto completado
              </button>
            )}

            <button
              className="btn-arcade btn-ghost rounded-2xl py-3 font-body font-bold text-base w-full"
              onClick={onBack}
            >
              ← Volver al menú
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
