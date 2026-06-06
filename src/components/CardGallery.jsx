import { cards } from '../data/cards'

/**
 * Galería de las 12 cartas desbloqueadas.
 * Se muestra dentro del BossFinal tras completar todos los minijuegos.
 */
export default function CardGallery() {
  return (
    <section>
      <div className="text-center mb-6">
        <p
          className="font-body font-bold text-xs uppercase tracking-widest mb-1"
          style={{ color: '#ffd700' }}
        >
          ✨ Colección desbloqueada
        </p>
        <h3
          className="font-arcade m-0"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', color: 'white' }}
        >
          Las 12 cartas de Dani
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gap: '10px',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="animate-scale-in"
            style={{
              animationDelay: `${i * 0.05}s`,
              animationFillMode: 'both',
            }}
          >
            <div
              style={{
                aspectRatio: '2/3',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '2px solid rgba(255,215,0,0.3)',
                boxShadow: '0 4px 20px rgba(255,215,0,0.15)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08) rotate(-1deg)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,215,0,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,215,0,0.15)'
              }}
            >
              <img
                src={card.image}
                alt={card.label}
                draggable="false"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => {
                  e.target.style.display = 'none'
                  const p = e.target.parentElement
                  p.style.background = `hsl(${(card.id * 30) % 360}, 60%, 25%)`
                  p.style.display = 'flex'
                  p.style.alignItems = 'center'
                  p.style.justifyContent = 'center'
                  p.innerHTML = `<span style="font-size:1.5rem;color:rgba(255,255,255,0.4)">${card.id}</span>`
                }}
              />
            </div>
            <p
              className="font-body text-center text-xs mt-1 font-bold"
              style={{ color: 'rgba(255,215,0,0.6)' }}
            >
              #{card.id}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
