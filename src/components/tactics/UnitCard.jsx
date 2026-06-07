/** Carta de unidad — usada en TeamBuilder y BattleBoard */
export default function UnitCard({ unit, selected, onClick, disabled, size = 'md', showStats = false }) {
  const COST_COLORS = { 1: '#aaaaaa', 2: '#39ff14', 3: '#00d4ff', 4: '#8b5cf6', 5: '#ffd700' }
  const costColor = COST_COLORS[unit.cost] || '#ffffff'

  const sizeStyles = {
    sm: { card: { width: '80px', minHeight: '110px' }, portrait: '64px', nameSize: '10px' },
    md: { card: { width: '110px', minHeight: '150px' }, portrait: '80px', nameSize: '11px' },
    lg: { card: { width: '140px', minHeight: '190px' }, portrait: '100px', nameSize: '13px' },
  }
  const sz = sizeStyles[size] || sizeStyles.md

  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      aria-pressed={selected}
      aria-label={`${unit.name} — ${unit.className}`}
      style={{
        ...sz.card,
        position: 'relative',
        border: selected
          ? `2px solid ${costColor}`
          : '2px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        background: selected
          ? `rgba(${hexToRgb(costColor)}, 0.15)`
          : 'rgba(18,18,30,0.9)',
        boxShadow: selected ? `0 0 20px ${costColor}55` : '0 4px 16px rgba(0,0,0,0.4)',
        cursor: (disabled && !selected) ? 'not-allowed' : 'pointer',
        opacity: (disabled && !selected) ? 0.45 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 6px 10px',
        gap: '4px',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!disabled || selected) e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Coste */}
      <div style={{ position: 'absolute', top: '5px', left: '6px', display: 'flex', gap: '1px' }}>
        {Array.from({ length: unit.cost }).map((_, i) => (
          <span key={i} style={{ fontSize: '8px', color: costColor, lineHeight: 1 }}>★</span>
        ))}
      </div>

      {/* Mascota badge */}
      {unit.isPet && (
        <div style={{ position: 'absolute', top: '5px', right: '6px', fontSize: '10px' }}>🐾</div>
      )}

      {/* Retrato */}
      <div style={{
        width: sz.portrait,
        height: sz.portrait,
        borderRadius: '10px',
        overflow: 'hidden',
        background: `linear-gradient(135deg, hsl(${unit.cost * 60}, 70%, 20%), #08080f)`,
        border: `1px solid ${costColor}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '12px',
        flexShrink: 0,
      }}>
        <img
          src={unit.image}
          alt={unit.name}
          draggable="false"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.parentElement.innerHTML = `<span style="font-size:2rem;opacity:0.7">${unit.isPet ? '🐾' : '👤'}</span>`
          }}
        />
      </div>

      {/* Nombre */}
      <p style={{
        margin: 0,
        fontFamily: 'Bangers, cursive',
        fontSize: sz.nameSize,
        color: selected ? costColor : 'white',
        textAlign: 'center',
        letterSpacing: '0.05em',
        lineHeight: 1.2,
        textShadow: selected ? `0 0 10px ${costColor}` : 'none',
      }}>
        {unit.name}
      </p>

      {/* Clase */}
      <p style={{
        margin: 0,
        fontSize: '9px',
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        fontFamily: 'Nunito, sans-serif',
        lineHeight: 1,
      }}>
        {unit.className}
      </p>

      {/* Stats en modo grande */}
      {showStats && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: '❤️', value: unit.hp },
            { label: '⚔️', value: unit.attack },
            { label: '🛡️', value: unit.defense },
          ].map(s => (
            <span key={s.label} style={{
              fontSize: '9px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              color: 'rgba(255,255,255,0.7)',
            }}>
              {s.label}{s.value}
            </span>
          ))}
        </div>
      )}

      {/* Overlay seleccionado */}
      {selected && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: costColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '9px',
          color: '#08080f',
          fontWeight: 900,
        }}>
          ✓
        </div>
      )}
    </button>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
