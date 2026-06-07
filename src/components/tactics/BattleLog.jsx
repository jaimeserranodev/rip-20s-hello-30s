import { useEffect, useRef } from 'react'

const TYPE_STYLES = {
  'round':        { color: 'rgba(255,255,255,0.3)', prefix: '' },
  'init':         { color: '#00d4ff',   prefix: '' },
  'attack':       { color: '#ffffff',   prefix: '' },
  'crit':         { color: '#ffd700',   prefix: '' },
  'ability':      { color: '#8b5cf6',   prefix: '' },
  'heal':         { color: '#39ff14',   prefix: '' },
  'enemy-attack': { color: '#ff7777',   prefix: '' },
  'boss-ability': { color: '#ff2d78',   prefix: '' },
  'death':        { color: '#ff4444',   prefix: '' },
  'shield':       { color: '#00d4ff',   prefix: '' },
  'stun':         { color: '#ffd700',   prefix: '' },
  'victory':      { color: '#39ff14',   prefix: '' },
  'defeat':       { color: '#ff4444',   prefix: '' },
}

export default function BattleLog({ events, currentStep }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentStep])

  const visibleEvents = events.slice(0, currentStep + 1)
    .filter(e => e.message && e.type !== 'round' || (e.type === 'round' && currentStep > 0))

  return (
    <div style={{
      background: 'rgba(8,8,15,0.8)',
      border: '1px solid rgba(139,92,246,0.2)',
      borderRadius: '14px',
      padding: '12px',
      height: '180px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <p style={{
        margin: '0 0 6px',
        fontFamily: 'Bangers, cursive',
        fontSize: '13px',
        color: '#8b5cf6',
        letterSpacing: '0.1em',
      }}>
        📜 REGISTRO DE COMBATE
      </p>

      {visibleEvents.length === 0 && (
        <p style={{ margin: 0, fontFamily: 'Nunito,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          El combate está a punto de comenzar...
        </p>
      )}

      {visibleEvents.map((event, i) => {
        const style = TYPE_STYLES[event.type] || TYPE_STYLES['attack']
        return (
          <p key={i} style={{
            margin: 0,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '12px',
            fontWeight: event.type === 'crit' || event.type === 'boss-ability' ? 900 : 600,
            color: style.color,
            lineHeight: 1.4,
            borderLeft: event.type === 'round' ? 'none' : `2px solid ${style.color}44`,
            paddingLeft: event.type === 'round' ? '0' : '6px',
            opacity: i === visibleEvents.length - 1 ? 1 : 0.7,
          }}>
            {event.message}
          </p>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
