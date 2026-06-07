import { getImageSrc } from '../data/tetrisPieces'

export default function TetrisCell({ imgIndex, isGhost }) {
  if (!imgIndex) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.35)',
        borderRight: '1px solid rgba(255,255,255,0.025)',
        borderBottom: '1px solid rgba(255,255,255,0.025)',
      }} />
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', opacity: isGhost ? 0.28 : 1 }}>
      <img
        src={getImageSrc(imgIndex)}
        alt=""
        draggable="false"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.parentElement.style.background = `hsl(${imgIndex * 23 % 360}, 70%, 45%)`
        }}
      />
    </div>
  )
}
