import { useState } from 'react'
import { UNITS, MAX_TEAM_SIZE } from '../../data/units'
import { calculateSynergies } from '../../utils/synergyEngine'
import UnitCard from './UnitCard'
import SynergyPanel from './SynergyPanel'

export default function TeamBuilder({ selectedLevel, onStartBattle, onBack }) {
  const [team, setTeam] = useState([])

  const { activeSynergies } = calculateSynergies(
    team.map(id => UNITS.find(u => u.id === id)).filter(Boolean)
  )

  function toggleUnit(unitId) {
    setTeam(prev => {
      if (prev.includes(unitId)) return prev.filter(id => id !== unitId)
      if (prev.length >= MAX_TEAM_SIZE) return prev
      return [...prev, unitId]
    })
  }

  const selectedUnits = team.map(id => UNITS.find(u => u.id === id)).filter(Boolean)

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <p style={{ margin: '0 0 2px', fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '12px', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Nivel {selectedLevel.id}: {selectedLevel.name}
        </p>
        <h2 style={{ margin: 0, fontFamily: 'Bangers,cursive', fontSize: 'clamp(1.6rem,6vw,2.4rem)', color: '#ff2d78', textShadow: '0 0 15px #ff2d7888' }}>
          Elige tu equipo
        </h2>
        <p style={{ margin: '4px 0 0', fontFamily: 'Nunito,sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          {team.length} / {MAX_TEAM_SIZE} unidades seleccionadas
        </p>
      </div>

      {/* Barra de equipo seleccionado */}
      <div style={{
        background: 'rgba(255,45,120,0.06)',
        border: '1px solid rgba(255,45,120,0.2)',
        borderRadius: '14px',
        padding: '12px',
        marginBottom: '16px',
        minHeight: '60px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {team.length === 0 ? (
          <p style={{ margin: 0, fontFamily: 'Nunito,sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
            Haz clic en las unidades para añadirlas...
          </p>
        ) : (
          selectedUnits.map(u => (
            <button
              key={u.id}
              onClick={() => toggleUnit(u.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              }}
              title={`Quitar a ${u.name}`}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden',
                border: '2px solid #ff2d78',
                background: `linear-gradient(135deg, hsl(${u.cost * 60}, 60%, 20%), #08080f)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={u.image} alt={u.name} draggable="false"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span style="font-size:1.3rem">${u.isPet?'🐾':'👤'}</span>` }}
                />
              </div>
              <span style={{ fontFamily: 'Nunito,sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>
                {u.name}
              </span>
            </button>
          ))
        )}

        {/* Slots vacíos */}
        {Array.from({ length: MAX_TEAM_SIZE - team.length }).map((_, i) => (
          <div key={i} style={{
            width: '44px', height: '44px', borderRadius: '10px',
            border: '2px dashed rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.02)',
          }} />
        ))}
      </div>

      {/* Grid de unidades */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        {UNITS.map(unit => (
          <UnitCard
            key={unit.id}
            unit={unit}
            selected={team.includes(unit.id)}
            disabled={team.length >= MAX_TEAM_SIZE && !team.includes(unit.id)}
            onClick={() => toggleUnit(unit.id)}
            size="md"
            showStats
          />
        ))}
      </div>

      {/* Sinergias activas */}
      {activeSynergies.length > 0 && (
        <div style={{
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '14px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          <p style={{ margin: '0 0 8px', fontFamily: 'Bangers,cursive', fontSize: '14px', color: '#8b5cf6', letterSpacing: '0.08em' }}>
            ✨ Sinergias Activas ({activeSynergies.length})
          </p>
          <SynergyPanel activeSynergies={activeSynergies} />
        </div>
      )}

      {/* Tip de unidad seleccionada */}
      {team.length > 0 && selectedUnits[selectedUnits.length - 1] && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          {(() => {
            const u = selectedUnits[selectedUnits.length - 1]
            return (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>{u.isPet ? '🐾' : '⚡'}</span>
                <div>
                  <p style={{ margin: '0 0 2px', fontFamily: 'Bangers,cursive', fontSize: '15px', color: 'white' }}>
                    {u.name} — {u.abilityName}
                  </p>
                  <p style={{ margin: '0 0 4px', fontFamily: 'Nunito,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    {u.abilityDescription}
                  </p>
                  <p style={{ margin: 0, fontFamily: 'Nunito,sans-serif', fontSize: '11px', color: 'rgba(255,215,0,0.7)', fontStyle: 'italic' }}>
                    "{u.quote}"
                  </p>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Botones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => team.length > 0 && onStartBattle(selectedUnits)}
          disabled={team.length === 0}
          style={{
            background: team.length > 0 ? 'linear-gradient(135deg, #ff2d78, #8b5cf6)' : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '14px',
            padding: '14px',
            color: team.length > 0 ? 'white' : 'rgba(255,255,255,0.25)',
            fontFamily: 'Bangers, cursive',
            fontSize: '1.3rem',
            letterSpacing: '0.05em',
            cursor: team.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: team.length > 0 ? '0 4px 20px rgba(255,45,120,0.4)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {team.length === 0 ? 'Selecciona al menos 1 unidad' : `⚔️ ¡Combatir! (${team.length} unidades)`}
        </button>
        <button
          onClick={onBack}
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
          ← Elegir otro nivel
        </button>
      </div>
    </div>
  )
}
