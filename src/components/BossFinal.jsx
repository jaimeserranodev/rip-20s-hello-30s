import { useState, useEffect } from 'react'
import { getProgress } from '../utils/storage'
import Confetti from './Confetti'
import CardGallery from './CardGallery'
import Layout from './Layout'

const BOSS_INTRO = `Han pasado los 20 años de caos, madrugadas cuestionables
y decisiones de las que nadie habla.

Ahora se alza ante ti el enemigo final: los 30.
Una década de sabiduría, responsabilidad…
y levantarte antes de las 12 (a veces).

¿Estás listo para derrotarlos?`

/** Barra de vida del boss que se vacía con la animación */
function BossHealthBar({ empty }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-body text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          HP Los 30
        </span>
        <span className="font-arcade text-sm" style={{ color: '#ff4444' }}>
          {empty ? '0 / 100' : '100 / 100'}
        </span>
      </div>
      <div
        style={{
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '99px',
          overflow: 'hidden',
          border: '1px solid rgba(255,68,68,0.3)',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '99px',
            background: 'linear-gradient(90deg, #ff4444, #ff8c00)',
            width: empty ? '0%' : '100%',
            transition: 'width 1.5s ease-out',
            boxShadow: '0 0 10px #ff444488',
          }}
        />
      </div>
    </div>
  )
}

export default function BossFinal({ onBack }) {
  const progress = getProgress()
  const allCompleted = progress.memoryCompleted && progress.quizCompleted && progress.rouletteCompleted

  const [phase, setPhase] = useState('intro')  // intro | battle | victory
  const [showConfetti, setShowConfetti] = useState(false)
  const [hpEmpty, setHpEmpty] = useState(false)
  const [shaking, setShaking] = useState(false)

  function handleDefeat() {
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
    setTimeout(() => setHpEmpty(true), 300)
    setTimeout(() => setPhase('victory'), 2000)
    setTimeout(() => setShowConfetti(true), 2100)
  }

  if (!allCompleted) {
    return (
      <Layout title="👹 Boss Final" onBack={onBack}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div
            className="glass-strong rounded-3xl p-8 max-w-md w-full animate-slide-up"
            style={{ border: '2px solid rgba(255,215,0,0.3)' }}
          >
            <div style={{ fontSize: '4rem' }}>🔒</div>
            <h2 className="font-arcade mt-3 mb-3" style={{ fontSize: '2rem', color: '#ffd700' }}>
              Bloqueado
            </h2>
            <p className="font-body text-base mb-6" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Debes completar los 3 minijuegos para enfrentarte al Boss Final.
            </p>
            <div className="flex flex-col gap-2 mb-6 text-left">
              {[
                { label: 'Memory de cartas', done: progress.memoryCompleted },
                { label: 'Quiz de Dani',     done: progress.quizCompleted },
                { label: 'Ruleta de retos',  done: progress.rouletteCompleted },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.done ? '✅' : '⬜'}</span>
                  <span className="font-body font-bold text-sm" style={{ color: item.done ? '#39ff14' : 'rgba(255,255,255,0.5)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-arcade btn-ghost rounded-2xl py-3 w-full font-body font-bold" onClick={onBack}>
              ← Volver al menú
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="👹 Boss Final" onBack={onBack}>
      {showConfetti && <Confetti />}

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <div
              className="animate-float"
              style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', filter: 'drop-shadow(0 0 20px #ff2d78)' }}
            >
              👹
            </div>
            <h1
              className="font-arcade text-center m-0"
              style={{
                fontSize: 'clamp(1.8rem, 7vw, 3rem)',
                color: '#ff2d78',
                textShadow: '0 0 30px #ff2d78aa',
              }}
            >
              Boss Final: Dani vs Los 30
            </h1>

            <div
              className="glass-strong rounded-3xl p-6 w-full"
              style={{ border: '1px solid rgba(255,45,120,0.3)' }}
            >
              <p
                className="font-body font-semibold text-base whitespace-pre-line text-center"
                style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}
              >
                {BOSS_INTRO}
              </p>
            </div>

            <button
              className="btn-arcade btn-primary rounded-2xl py-4 px-8 font-body font-black text-xl w-full max-w-sm"
              onClick={() => setPhase('battle')}
            >
              ⚔️ ¡Aceptar el desafío!
            </button>
          </div>
        )}

        {/* ── BATTLE ── */}
        {phase === 'battle' && (
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <h2
              className="font-arcade text-center m-0"
              style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                color: '#ffd700',
                textShadow: '0 0 20px #ffd70088',
              }}
            >
              ⚡ ¡Enfrentamiento épico!
            </h2>

            {/* Boss sprite + HP */}
            <div
              className={`glass-strong rounded-3xl p-6 w-full ${shaking ? 'animate-shake' : ''}`}
              style={{ border: '1px solid rgba(255,68,68,0.4)' }}
            >
              <div className="text-center mb-4">
                <span
                  className={hpEmpty ? 'animate-fade-in' : 'animate-float'}
                  style={{ fontSize: 'clamp(4rem, 15vw, 7rem)' }}
                >
                  {hpEmpty ? '💀' : '👹'}
                </span>
              </div>
              <BossHealthBar empty={hpEmpty} />
            </div>

            {/* VS */}
            <div
              className="font-arcade text-center"
              style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: '#ff2d78' }}
            >
              vs
            </div>

            {/* Player */}
            <div
              className="glass-strong rounded-3xl p-6 w-full"
              style={{ border: '1px solid rgba(57,255,20,0.3)' }}
            >
              <div className="text-center mb-4">
                <span
                  className="animate-float-reverse"
                  style={{ fontSize: 'clamp(4rem, 15vw, 7rem)' }}
                >
                  🦸
                </span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>HP Dani</span>
                  <span className="font-arcade text-sm" style={{ color: '#39ff14' }}>100 / 100</span>
                </div>
                <div
                  style={{
                    height: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                    border: '1px solid rgba(57,255,20,0.3)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '99px',
                      background: 'linear-gradient(90deg, #39ff14, #00cc44)',
                      width: '100%',
                      boxShadow: '0 0 10px #39ff1488',
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn-arcade btn-primary rounded-2xl py-4 px-8 font-body font-black text-xl w-full"
              onClick={handleDefeat}
              disabled={hpEmpty}
            >
              {hpEmpty ? '💀 Los 30 han caído...' : '💥 ¡Derrotar a los 30!'}
            </button>
          </div>
        )}

        {/* ── VICTORY ── */}
        {phase === 'victory' && (
          <div className="flex flex-col items-center gap-8 animate-slide-up">
            <div
              className="animate-victory text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 6rem)' }}
            >
              🏆
            </div>

            <div
              className="glass-strong rounded-3xl p-6 md:p-8 w-full text-center"
              style={{ border: '2px solid rgba(57,255,20,0.4)' }}
            >
              <h1
                className="font-arcade m-0 mb-4"
                style={{
                  fontSize: 'clamp(1.6rem, 6vw, 2.5rem)',
                  color: '#39ff14',
                  textShadow: '0 0 30px #39ff14',
                }}
              >
                ¡Victoria épica!
              </h1>
              <p
                className="font-body font-semibold text-lg md:text-xl whitespace-pre-line"
                style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}
              >
                {`Dani, has completado el multiverso.\n`}
                <span style={{ color: '#ffd700', fontSize: '1.1em' }}>
                  {`Que tus 30 sean legendarios.`}
                </span>
              </p>
            </div>

            {/* Galería de cartas */}
            <div
              className="glass rounded-3xl p-6 w-full"
              style={{ border: '1px solid rgba(255,215,0,0.2)' }}
            >
              <CardGallery />
            </div>

            <button
              className="btn-arcade btn-ghost rounded-2xl py-3 w-full font-body font-bold text-base"
              onClick={onBack}
            >
              ← Volver al menú
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
