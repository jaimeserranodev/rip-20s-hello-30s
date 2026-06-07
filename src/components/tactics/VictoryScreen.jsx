import Confetti from '../Confetti'

export default function VictoryScreen({ level, isFinalLevel, onNextLevel, onReplay, onMenu }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(8,8,15,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      <Confetti />
      <div style={{
        background: 'rgba(18,18,30,0.95)',
        border: '2px solid rgba(57,255,20,0.4)',
        borderRadius: '24px',
        padding: '32px 24px',
        maxWidth: '460px',
        width: '100%',
        textAlign: 'center',
        animation: 'bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 0 60px rgba(57,255,20,0.2)',
      }}>
        <div style={{ fontSize: '4rem', animation: 'victory-pulse 1s ease-in-out infinite' }}>🏆</div>

        <h2 style={{
          fontFamily: 'Bangers, cursive',
          fontSize: 'clamp(2rem,7vw,3rem)',
          color: '#39ff14',
          textShadow: '0 0 30px #39ff14',
          margin: '8px 0',
          letterSpacing: '0.05em',
        }}>
          ¡Victoria!
        </h2>

        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          color: 'rgba(255,255,255,0.8)',
          margin: '0 0 8px',
        }}>
          Nivel {level.id} completado: <span style={{ color: '#ffd700' }}>{level.name}</span>
        </p>

        {isFinalLevel && (
          <div style={{
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '12px',
            padding: '12px',
            margin: '12px 0',
          }}>
            <p style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: '15px',
              color: '#ffd700',
              margin: 0,
              lineHeight: 1.5,
            }}>
              🎂 ¡Has derrotado a Los 30!<br />
              <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                Dani Birthday Tactics completado.<br />
                Los 30 nunca fueron rival para este equipo.
              </span>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {!isFinalLevel && onNextLevel && (
            <button
              onClick={onNextLevel}
              style={{
                background: 'linear-gradient(135deg, #39ff14, #00cc44)',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                color: '#08080f',
                fontFamily: 'Bangers, cursive',
                fontSize: '1.3rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(57,255,20,0.4)',
              }}
            >
              Siguiente nivel →
            </button>
          )}
          <button
            onClick={onReplay}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '12px',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'Nunito,sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            🔄 Repetir nivel
          </button>
          <button
            onClick={onMenu}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px',
              color: 'rgba(255,255,255,0.45)',
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
