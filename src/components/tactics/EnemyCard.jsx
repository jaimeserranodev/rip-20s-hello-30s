/** Carta de enemigo en el BattleBoard */
export default function EnemyCard({ enemy, currentHp, shield = 0, isAttacking, isHit }) {
  const isDead = currentHp <= 0
  const hpPct = Math.max(0, currentHp / enemy.maxHp)

  const barColor = hpPct > 0.5 ? '#39ff14' : hpPct > 0.25 ? '#ffd700' : '#ff4444'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        width: '90px',
        opacity: isDead ? 0.3 : 1,
        filter: isDead ? 'grayscale(1)' : isHit ? 'brightness(1.8)' : 'none',
        transition: 'opacity 0.5s, filter 0.1s',
        transform: isAttacking ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {/* Boss badge */}
      {enemy.isBoss && !isDead && (
        <span style={{ fontSize: '10px', color: '#ff2d78', fontFamily: 'Nunito,sans-serif', fontWeight: 900 }}>
          ★ BOSS
        </span>
      )}

      {/* Retrato emoji */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        background: enemy.isBoss
          ? 'linear-gradient(135deg, #ff2d7833, #08080f)'
          : 'linear-gradient(135deg, #2a1a1a, #08080f)',
        border: enemy.isBoss
          ? '2px solid #ff2d7866'
          : '2px solid rgba(255,68,68,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: enemy.isBoss ? '2.2rem' : '2rem',
        boxShadow: enemy.isBoss ? '0 0 20px #ff2d7844' : 'none',
      }}>
        {isDead ? '💀' : enemy.emoji}
      </div>

      {/* Nombre */}
      <p style={{
        margin: 0,
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 900,
        fontSize: '10px',
        color: isDead ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {enemy.name}
      </p>

      {/* HP bar */}
      {!isDead && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito,sans-serif' }}>HP</span>
            <span style={{ fontSize: '9px', color: barColor, fontFamily: 'Nunito,sans-serif', fontWeight: 700 }}>
              {currentHp}/{enemy.maxHp}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${hpPct * 100}%`,
              background: barColor,
              borderRadius: '99px',
              transition: 'width 0.4s ease, background 0.3s',
              boxShadow: `0 0 6px ${barColor}88`,
            }} />
          </div>
          {shield > 0 && (
            <div style={{ fontSize: '9px', color: '#00d4ff', fontFamily: 'Nunito,sans-serif', textAlign: 'center' }}>
              🛡️ {shield}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
