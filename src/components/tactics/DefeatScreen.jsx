export default function DefeatScreen({ level, onReplay, onMenu }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(8,8,15,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      <div style={{
        background: 'rgba(18,18,30,0.95)',
        border: '2px solid rgba(255,68,68,0.4)',
        borderRadius: '24px',
        padding: '32px 24px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        animation: 'scale-in 0.4s ease-out forwards',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 0 40px rgba(255,68,68,0.15)',
      }}>
        <div style={{ fontSize: '4rem' }}>💀</div>

        <h2 style={{
          fontFamily: 'Bangers, cursive',
          fontSize: 'clamp(2rem,7vw,3rem)',
          color: '#ff4444',
          textShadow: '0 0 20px #ff444488',
          margin: '8px 0',
          letterSpacing: '0.05em',
        }}>
          Derrota
        </h2>

        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          color: 'rgba(255,255,255,0.7)',
          margin: '0 0 12px',
          lineHeight: 1.5,
        }}>
          El equipo ha caído en el <span style={{ color: '#ff7777' }}>Nivel {level.id}: {level.name}</span>
        </p>

        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          margin: '0 0 20px',
          fontStyle: 'italic',
        }}>
          Prueba otra combinación de unidades o aprovecha las sinergias.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onReplay}
            style={{
              background: 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
              border: 'none',
              borderRadius: '14px',
              padding: '14px',
              color: 'white',
              fontFamily: 'Bangers, cursive',
              fontSize: '1.3rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255,45,120,0.3)',
            }}
          >
            🔄 Intentar de nuevo
          </button>
          <button
            onClick={onMenu}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '12px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'Nunito,sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ← Menú principal
          </button>
        </div>
      </div>
    </div>
  )
}
