export default function ChoiceButton({ label, onClick, index = 0 }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '10px 14px',
        marginTop: index === 0 ? 0 : '7px',
        background: 'rgba(0,0,0,0.38)',
        border: '1px solid rgba(220,200,160,0.35)',
        borderLeft: '3px solid rgba(220,200,160,0.6)',
        borderRadius: '3px',
        color: 'rgba(235,220,195,0.95)',
        fontSize: 'clamp(0.78rem, 1.8vw, 0.9rem)',
        fontFamily: 'Georgia, "Times New Roman", serif',
        letterSpacing: '0.02em',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        lineHeight: 1.45,
        backdropFilter: 'blur(6px)',
        textShadow: '0 1px 4px rgba(0,0,0,0.9)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(220,200,160,0.15)'
        e.currentTarget.style.borderLeftColor = 'rgba(220,200,160,1)'
        e.currentTarget.style.color = '#efe8d5'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.38)'
        e.currentTarget.style.borderLeftColor = 'rgba(220,200,160,0.6)'
        e.currentTarget.style.color = 'rgba(235,220,195,0.95)'
      }}
    >
      {label}
    </button>
  )
}
