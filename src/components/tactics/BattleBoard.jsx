import { useState, useEffect, useRef } from 'react'
import EnemyCard from './EnemyCard'
import BattleLog from './BattleLog'

const STEP_DELAY = 900 // ms entre pasos

/** Número flotante de daño */
function FloatingNumber({ damage, isCrit, isHeal, top, left }) {
  return (
    <div style={{
      position: 'absolute',
      top,
      left,
      transform: 'translate(-50%, -50%)',
      fontFamily: 'Bangers, cursive',
      fontSize: isCrit ? '1.8rem' : isHeal ? '1.3rem' : '1.2rem',
      color: isHeal ? '#39ff14' : isCrit ? '#ffd700' : '#ff7777',
      textShadow: `0 0 10px ${isCrit ? '#ffd700' : isHeal ? '#39ff14' : '#ff2d78'}`,
      animation: 'damage-float 1.2s ease-out forwards',
      pointerEvents: 'none',
      zIndex: 100,
      whiteSpace: 'nowrap',
    }}>
      {isHeal ? `+${damage}` : isCrit ? `💥${damage}!` : `-${damage}`}
    </div>
  )
}

/** Unidad en el tablero de combate */
function BattleFighter({ unit, currentHp, shield, isAttacking, isHit }) {
  const isDead = currentHp <= 0
  const hpPct = Math.max(0, currentHp / unit.maxHp)
  const barColor = hpPct > 0.5 ? '#39ff14' : hpPct > 0.25 ? '#ffd700' : '#ff4444'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '5px',
      width: '80px',
      opacity: isDead ? 0.25 : 1,
      filter: isDead ? 'grayscale(1)' : isHit ? 'brightness(2) saturate(2)' : 'none',
      transform: isAttacking ? 'translateX(8px) scale(1.08)' : 'translateX(0) scale(1)',
      transition: 'all 0.15s ease',
    }}>
      {/* Retrato */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: `2px solid ${isAttacking ? '#ffd700' : isHit ? '#ff4444' : 'rgba(255,255,255,0.15)'}`,
        background: `linear-gradient(135deg, hsl(${unit.cost * 60}, 60%, 20%), #08080f)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isAttacking ? '0 0 15px #ffd70066' : 'none',
      }}>
        <img
          src={unit.image}
          alt={unit.name}
          draggable="false"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.parentElement.innerHTML = `<span style="font-size:1.8rem">${unit.isPet ? '🐾' : '👤'}</span>`
          }}
        />
      </div>

      {/* Nombre */}
      <p style={{
        margin: 0,
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 900,
        fontSize: '10px',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 1.1,
      }}>
        {unit.name}
      </p>

      {/* HP bar */}
      {!isDead && (
        <div style={{ width: '100%' }}>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${hpPct * 100}%`,
              background: barColor,
              borderRadius: '99px',
              transition: 'width 0.4s ease',
              boxShadow: `0 0 4px ${barColor}`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '8px', color: barColor, fontFamily: 'Nunito,sans-serif', fontWeight: 700 }}>
              {currentHp}
            </span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Nunito,sans-serif' }}>
              {unit.maxHp}
            </span>
          </div>
          {shield > 0 && (
            <div style={{ fontSize: '9px', color: '#00d4ff', textAlign: 'center', fontFamily: 'Nunito,sans-serif' }}>
              🛡️{shield}
            </div>
          )}
        </div>
      )}
      {isDead && (
        <span style={{ fontSize: '1.2rem' }}>💀</span>
      )}
    </div>
  )
}

export default function BattleBoard({ events, playerTeam, enemies, onBattleEnd, speed = 1 }) {
  const [step, setStep] = useState(0)
  const [floaters, setFloaters] = useState([])
  const timerRef = useRef(null)
  const floaterIdRef = useRef(0)

  const currentEvent = events[step] || events[events.length - 1]

  // Estado de HP desde el evento actual
  const playerHPs     = currentEvent?.playerHPs     || {}
  const enemyHPs      = currentEvent?.enemyHPs      || {}
  const playerShields = currentEvent?.playerShields || {}

  // Qué unidades están atacando o siendo golpeadas
  const attackerId = currentEvent?.attackerId
  const targetId   = currentEvent?.targetId

  // Avance automático de pasos
  useEffect(() => {
    if (step >= events.length - 1) {
      clearInterval(timerRef.current)
      const last = events[events.length - 1]
      if (last) onBattleEnd(last.type === 'victory')
      return
    }

    const delay = STEP_DELAY / speed

    timerRef.current = setTimeout(() => {
      const ev = events[step + 1]

      // Número flotante de daño
      if (ev && (ev.damage || ev.heal) && ev.targetId) {
        const isEnemy = ev.type === 'attack' || ev.type === 'crit' || ev.type === 'ability'
        addFloater(ev.damage || ev.heal, ev.isCrit, !!ev.heal, isEnemy)
      }

      setStep(s => s + 1)
    }, delay)

    return () => clearTimeout(timerRef.current)
  }, [step, events, speed, onBattleEnd])

  function addFloater(amount, isCrit, isHeal, isEnemy) {
    const id = floaterIdRef.current++
    const top  = `${20 + Math.random() * 40}%`
    const left = isEnemy ? `${60 + Math.random() * 30}%` : `${10 + Math.random() * 30}%`
    setFloaters(f => [...f, { id, amount, isCrit, isHeal, top, left }])
    setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 1300)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      {/* Números flotantes */}
      <div style={{ position: 'relative', height: 0 }}>
        {floaters.map(f => (
          <FloatingNumber key={f.id} damage={f.amount} isCrit={f.isCrit} isHeal={f.isHeal} top={f.top} left={f.left} />
        ))}
      </div>

      {/* Tablero de combate */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        background: 'rgba(8,8,15,0.7)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '16px',
        padding: '16px 12px',
        minHeight: '180px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Fondo degradado */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Equipo jugador — izquierda */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          flex: 1,
          justifyContent: 'flex-start',
        }}>
          {playerTeam.map(unit => (
            <BattleFighter
              key={unit.id}
              unit={unit}
              currentHp={playerHPs[unit.id] ?? unit.hp}
              shield={playerShields[unit.id] ?? 0}
              isAttacking={attackerId === unit.id && (currentEvent?.type === 'attack' || currentEvent?.type === 'crit' || currentEvent?.type === 'ability')}
              isHit={targetId === unit.id && (currentEvent?.type === 'enemy-attack' || currentEvent?.type === 'boss-ability')}
            />
          ))}
        </div>

        {/* VS */}
        <div style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '1.8rem',
          color: '#ff2d78',
          textShadow: '0 0 20px #ff2d78',
          flexShrink: 0,
          zIndex: 1,
        }}>
          VS
        </div>

        {/* Equipo enemigo — derecha */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          flex: 1,
          justifyContent: 'flex-end',
        }}>
          {enemies.map(enemy => (
            <EnemyCard
              key={enemy.id}
              enemy={enemy}
              currentHp={enemyHPs[enemy.id] ?? enemy.hp}
              shield={0}
              isAttacking={attackerId === enemy.id}
              isHit={targetId === enemy.id && (currentEvent?.type === 'attack' || currentEvent?.type === 'crit')}
            />
          ))}
        </div>
      </div>

      {/* Log de combate */}
      <BattleLog events={events} currentStep={step} />

      {/* Indicador de ronda */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
        }}>
          Paso {Math.min(step + 1, events.length)} / {events.length}
        </span>
      </div>
    </div>
  )
}
