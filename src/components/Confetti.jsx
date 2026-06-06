import { useEffect, useRef } from 'react'

const COLORS = ['#ff2d78', '#00d4ff', '#ffd700', '#8b5cf6', '#39ff14', '#ff8c00', '#ffffff']
const COUNT = 80

/**
 * Componente de confeti animado con CSS puro.
 * Se renderiza sobre el contenido actual (fixed, pointer-events-none).
 */
export default function Confetti() {
  const pieces = useRef(
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2.5 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 10,
      isCircle: Math.random() > 0.5,
      swayDelay: Math.random() * 2,
      swayDuration: 1.5 + Math.random() * 2,
    }))
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {pieces.current.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ${p.delay}s linear infinite,
                        confetti-sway ${p.swayDuration}s ${p.swayDelay}s ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}
