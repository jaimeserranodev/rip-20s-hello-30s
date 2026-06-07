/** Panel de sinergias activas */
export default function SynergyPanel({ activeSynergies }) {
  if (!activeSynergies.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontFamily: 'Nunito,sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          Selecciona unidades para activar sinergias
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {activeSynergies.map(syn => (
        <div
          key={syn.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: `rgba(${hexToRgb(syn.color)}, 0.08)`,
            border: `1px solid ${syn.color}33`,
            borderRadius: '12px',
            padding: '10px 12px',
          }}
        >
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{syn.emoji}</span>
          <div>
            <p style={{
              margin: 0,
              fontFamily: 'Bangers, cursive',
              fontSize: '14px',
              color: syn.color,
              letterSpacing: '0.05em',
              lineHeight: 1.2,
            }}>
              {syn.name}
            </p>
            <p style={{ margin: 0, fontFamily: 'Nunito,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>
              {syn.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return '255,255,255'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
