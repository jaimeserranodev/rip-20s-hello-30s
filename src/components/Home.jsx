import { useState, useEffect } from 'react'

const FLOATING_EMOJIS = ['🎮', '🃏', '⭐', '🎂', '🎊', '🕹️', '🏆', '💥', '🎯', '🎁']

function FloatingItem({ emoji, style }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        fontSize: style.size,
        opacity: style.opacity,
        left: style.left,
        top: style.top,
        animation: `${style.anim} ${style.dur}s ease-in-out infinite`,
        animationDelay: `${style.delay}s`,
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(0 0 8px ${style.color})`,
      }}
    >
      {emoji}
    </span>
  )
}

export default function Home({ onEnter }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const floatingItems = [
    { emoji: '🎮', style: { size: '2.5rem', opacity: 0.35, left: '5%',  top: '15%', anim: 'float',         dur: 4,   delay: 0,   color: '#ff2d78' } },
    { emoji: '🃏', style: { size: '2rem',   opacity: 0.3,  left: '88%', top: '20%', anim: 'float-reverse', dur: 3.5, delay: 0.5, color: '#00d4ff' } },
    { emoji: '⭐', style: { size: '1.8rem', opacity: 0.4,  left: '75%', top: '55%', anim: 'float',         dur: 5,   delay: 1,   color: '#ffd700' } },
    { emoji: '🎂', style: { size: '3rem',   opacity: 0.25, left: '10%', top: '60%', anim: 'float-reverse', dur: 4.5, delay: 0.8, color: '#8b5cf6' } },
    { emoji: '🎊', style: { size: '2.2rem', opacity: 0.3,  left: '50%', top: '8%',  anim: 'float',         dur: 3.8, delay: 1.5, color: '#ff2d78' } },
    { emoji: '🕹️', style: { size: '2.5rem', opacity: 0.35, left: '92%', top: '70%', anim: 'float-reverse', dur: 4.2, delay: 0.3, color: '#39ff14' } },
    { emoji: '🏆', style: { size: '1.6rem', opacity: 0.3,  left: '3%',  top: '80%', anim: 'float',         dur: 5,   delay: 2,   color: '#ffd700' } },
    { emoji: '💥', style: { size: '2rem',   opacity: 0.25, left: '65%', top: '85%', anim: 'float-reverse', dur: 3.6, delay: 1.2, color: '#ff8c00' } },
    { emoji: '🎯', style: { size: '1.8rem', opacity: 0.3,  left: '30%', top: '90%', anim: 'float',         dur: 4.8, delay: 0.7, color: '#ff2d78' } },
    { emoji: '🎁', style: { size: '2.2rem', opacity: 0.35, left: '80%', top: '40%', anim: 'float-reverse', dur: 4,   delay: 1.8, color: '#00d4ff' } },
  ]

  return (
    <div
      className="relative w-full min-h-dvh flex flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a050f 60%, #08080f 100%)' }}
    >
      {/* Scanlines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      {floatingItems.map((item, i) => <FloatingItem key={i} {...item} />)}

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <div
          className="animate-slide-up mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full font-body font-bold text-sm"
          style={{
            background: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#c084fc', animationFillMode: 'both',
          }}
        >
          <span>🎮</span> Experiencia arcade personalizada
        </div>

        <h1
          className="font-arcade animate-slide-up delay-100 m-0 leading-none"
          style={{
            fontSize: 'clamp(2.8rem, 10vw, 6rem)',
            color: '#ff2d78',
            textShadow: '0 0 30px #ff2d78aa, 0 0 60px #ff2d7855',
            letterSpacing: '0.02em', animationFillMode: 'both',
          }}
        >
          RIP 20's,
        </h1>
        <h1
          className="font-arcade animate-slide-up delay-200 m-0 leading-none"
          style={{
            fontSize: 'clamp(2.8rem, 10vw, 6rem)',
            color: '#ffd700',
            textShadow: '0 0 30px #ffd700aa, 0 0 60px #ffd70055',
            letterSpacing: '0.02em', animationFillMode: 'both',
          }}
        >
          Hello 30's
        </h1>

        <div
          className="font-arcade animate-slide-up delay-300 mt-2"
          style={{
            fontSize: 'clamp(4rem, 16vw, 9rem)',
            color: '#00d4ff',
            textShadow: '0 0 40px #00d4ffbb, 0 0 80px #00d4ff55',
            lineHeight: 0.9, letterSpacing: '0.05em', animationFillMode: 'both',
          }}
        >
          DANI
        </div>

        <p
          className="animate-slide-up delay-400 mt-6 font-body text-lg md:text-xl font-semibold"
          style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', lineHeight: 1.5, animationFillMode: 'both' }}
        >
          30 años de leyenda merecen una celebración épica.
          <br />
          <span style={{ color: '#ffd700' }}>Tu multiverso personal te espera...</span>
        </p>

        <button
          onClick={onEnter}
          className="btn-arcade btn-primary animate-slide-up delay-500 mt-10 rounded-2xl font-body font-black text-xl md:text-2xl"
          style={{
            padding: '1rem 2.5rem',
            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
            animation: 'slide-up 0.6s 0.5s ease-out both, pulse-glow-pink 2s 1.2s ease-in-out infinite',
            letterSpacing: '0.03em',
          }}
        >
          🕹️ Entrar al Multiverso de Dani
        </button>

        <p
          className="animate-slide-up delay-600 mt-8 font-body text-sm"
          style={{ color: 'rgba(255,255,255,0.3)', animationFillMode: 'both' }}
        >
          3 minijuegos · 1 boss final · Solo para valientes
        </p>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(transparent, #08080f)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
