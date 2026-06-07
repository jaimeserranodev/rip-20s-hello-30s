const STAT_ROWS = [
  { key: 'score', label: 'SCORE', color: '#ffd700', fmt: v => v.toLocaleString() },
  { key: 'lines', label: 'LÍNEAS', color: '#00d4ff', fmt: v => v },
  { key: 'level', label: 'NIVEL', color: '#ff2d78', fmt: v => v + 1 },
]

export default function GameStats({ score, lines, level }) {
  const vals = { score, lines, level }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {STAT_ROWS.map(({ key, label, color, fmt }) => (
        <div
          key={key}
          className="glass rounded-xl p-2 text-center"
          style={{ border: `1px solid ${color}33` }}
        >
          <p className="font-body m-0" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
            {label}
          </p>
          <p className="font-arcade m-0" style={{ fontSize: '1.15rem', color, lineHeight: 1.2 }}>
            {fmt(vals[key])}
          </p>
        </div>
      ))}
    </div>
  )
}
