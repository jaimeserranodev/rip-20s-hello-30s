import { LEVELS } from '../../data/enemies'

export default function LevelSelect({ unlockedLevel, onSelectLevel, onBack }) {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ margin: '0 0 4px', fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '12px', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          🎮 Dani Birthday Tactics
        </p>
        <h1 style={{ margin: 0, fontFamily: 'Bangers,cursive', fontSize: 'clamp(2rem,7vw,3rem)', color: '#ffd700', textShadow: '0 0 20px #ffd70088', letterSpacing: '0.05em' }}>
          Selecciona Nivel
        </h1>
      </div>

      {/* Niveles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LEVELS.map(level => {
          const isLocked   = level.id > unlockedLevel
          const isCompleted = level.id < unlockedLevel
          const isCurrent  = level.id === unlockedLevel

          return (
            <button
              key={level.id}
              onClick={() => !isLocked && onSelectLevel(level.id)}
              disabled={isLocked}
              style={{
                background: isLocked ? 'rgba(255,255,255,0.03)' : `rgba(${hexToRgb(level.color)}, 0.08)`,
                border: isLocked
                  ? '1px solid rgba(255,255,255,0.06)'
                  : isCurrent
                  ? `2px solid ${level.color}`
                  : `1px solid ${level.color}44`,
                borderRadius: '16px',
                padding: '16px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                textAlign: 'left',
                opacity: isLocked ? 0.4 : 1,
                boxShadow: isCurrent ? `0 0 20px ${level.color}33` : 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isLocked) e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)' }}
            >
              {/* Emoji del nivel */}
              <span style={{ fontSize: '2.5rem', filter: isLocked ? 'grayscale(1)' : 'none' }}>
                {isLocked ? '🔒' : isCompleted ? '✅' : level.emoji}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <p style={{ margin: 0, fontFamily: 'Bangers,cursive', fontSize: '1.2rem', color: isLocked ? 'rgba(255,255,255,0.25)' : 'white', letterSpacing: '0.04em' }}>
                    Nivel {level.id}: {level.name}
                  </p>
                  {isCurrent && (
                    <span style={{
                      fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: '10px',
                      background: level.color, color: '#08080f',
                      padding: '2px 8px', borderRadius: '99px',
                    }}>
                      ACTUAL
                    </span>
                  )}
                  {isCompleted && (
                    <span style={{
                      fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: '10px',
                      background: '#39ff1422', color: '#39ff14', border: '1px solid #39ff1444',
                      padding: '2px 8px', borderRadius: '99px',
                    }}>
                      COMPLETADO
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontFamily: 'Nunito,sans-serif', fontSize: '12px', color: isLocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }}>
                  {level.subtitle}
                </p>
                {!isLocked && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {level.enemies.map(e => (
                      <span key={e.id} style={{
                        fontFamily: 'Nunito,sans-serif', fontSize: '11px', fontWeight: 700,
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)', borderRadius: '6px', padding: '2px 6px',
                      }}>
                        {e.emoji} {e.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!isLocked && (
                <span style={{ fontFamily: 'Bangers,cursive', fontSize: '1.2rem', color: level.color }}>▶</span>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: '20px',
          width: '100%',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '12px',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'Nunito,sans-serif',
          fontWeight: 700,
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        ← Volver al menú
      </button>
    </div>
  )
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return '255,255,255'
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}
