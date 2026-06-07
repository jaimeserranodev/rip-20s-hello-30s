import { useState, useEffect } from 'react'
import { LEVELS, LEVEL_MAP } from '../../data/enemies'
import { calculateSynergies, applyStatEffects } from '../../utils/synergyEngine'
import { simulateBattle } from '../../utils/combatEngine'
import LevelSelect from './LevelSelect'
import TeamBuilder from './TeamBuilder'
import BattleBoard from './BattleBoard'
import VictoryScreen from './VictoryScreen'
import DefeatScreen from './DefeatScreen'

// Claves de localStorage para el progreso del Tactics
const LS_LEVEL    = 'tacticsLevelUnlocked'
const LS_COMPLETE = 'tacticsCompleted'

function getUnlockedLevel() {
  return parseInt(localStorage.getItem(LS_LEVEL) || '1', 10)
}
function setUnlockedLevel(n) {
  localStorage.setItem(LS_LEVEL, String(n))
}
function markTacticsComplete() {
  localStorage.setItem(LS_COMPLETE, 'true')
}

/**
 * Orquestador del Dani Birthday Tactics.
 * Fases: levelSelect → teamBuilder → battling → (victory | defeat)
 */
export default function TacticsGame({ onBack }) {
  const [phase, setPhase]             = useState('levelSelect')
  const [selectedLevelId, setLevelId] = useState(null)
  const [unlockedLevel, setUnlocked]  = useState(getUnlockedLevel)
  const [playerTeam, setPlayerTeam]   = useState([])
  const [battleData, setBattleData]   = useState(null)  // { events, victory }
  const [battleResult, setResult]     = useState(null)  // true | false

  const selectedLevel = selectedLevelId ? LEVEL_MAP[selectedLevelId] : null

  // ── Seleccionar nivel ──
  function handleSelectLevel(levelId) {
    setLevelId(levelId)
    setPhase('teamBuilder')
    setResult(null)
  }

  // ── Iniciar combate ──
  function handleStartBattle(team) {
    const { activeSynergies, statEffects } = calculateSynergies(team)
    const modifiedTeam = applyStatEffects(team, statEffects)

    // Pre-computar la secuencia de batalla
    const result = simulateBattle(modifiedTeam, selectedLevel.enemies, statEffects)

    setPlayerTeam(modifiedTeam)
    setBattleData(result)
    setPhase('battling')
  }

  // ── Fin del combate ──
  function handleBattleEnd(victory) {
    setResult(victory)

    if (victory) {
      // Desbloquear siguiente nivel si corresponde
      if (selectedLevelId >= unlockedLevel && selectedLevelId < LEVELS.length) {
        const next = selectedLevelId + 1
        setUnlocked(next)
        setUnlockedLevel(next)
      }
      // Si es el último nivel
      if (selectedLevel.isFinal) {
        markTacticsComplete()
      }
    }

    setPhase(victory ? 'victory' : 'defeat')
  }

  // ── Repetir nivel ──
  function handleReplay() {
    setPhase('teamBuilder')
    setBattleData(null)
    setResult(null)
    setPlayerTeam([])
  }

  // ── Siguiente nivel ──
  function handleNextLevel() {
    const nextId = selectedLevelId + 1
    if (LEVEL_MAP[nextId]) {
      setLevelId(nextId)
      setPhase('teamBuilder')
      setBattleData(null)
      setResult(null)
      setPlayerTeam([])
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #0a0515 0%, #08080f 100%)',
    }}>
      {/* Header sticky */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(8,8,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={phase === 'levelSelect' ? onBack : () => setPhase('levelSelect')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            padding: '6px 14px',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'Nunito,sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ← {phase === 'levelSelect' ? 'Menú' : 'Niveles'}
        </button>

        <h1 style={{
          margin: 0,
          fontFamily: 'Bangers, cursive',
          fontSize: 'clamp(1.2rem,5vw,1.8rem)',
          color: '#ffd700',
          textShadow: '0 0 15px #ffd70066',
          letterSpacing: '0.05em',
        }}>
          🎮 Dani Birthday Tactics
        </h1>

        {/* Nivel actual badge */}
        {selectedLevel && phase !== 'levelSelect' && (
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'Nunito,sans-serif',
            fontWeight: 900,
            fontSize: '11px',
            background: selectedLevel.color + '22',
            border: `1px solid ${selectedLevel.color}44`,
            color: selectedLevel.color,
            borderRadius: '8px',
            padding: '4px 8px',
          }}>
            {selectedLevel.emoji} Nv.{selectedLevel.id}
          </span>
        )}
      </header>

      {/* Contenido por fase */}
      {phase === 'levelSelect' && (
        <LevelSelect
          unlockedLevel={unlockedLevel}
          onSelectLevel={handleSelectLevel}
          onBack={onBack}
        />
      )}

      {phase === 'teamBuilder' && selectedLevel && (
        <TeamBuilder
          selectedLevel={selectedLevel}
          onStartBattle={handleStartBattle}
          onBack={() => setPhase('levelSelect')}
        />
      )}

      {phase === 'battling' && battleData && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '16px' }}>
          {/* Info del nivel */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{
              margin: 0,
              fontFamily: 'Bangers,cursive',
              fontSize: 'clamp(1.4rem,5vw,2rem)',
              color: selectedLevel.color,
              textShadow: `0 0 15px ${selectedLevel.color}66`,
            }}>
              {selectedLevel.emoji} {selectedLevel.name}
            </h2>
          </div>
          <BattleBoard
            events={battleData.events}
            playerTeam={playerTeam}
            enemies={selectedLevel.enemies}
            onBattleEnd={handleBattleEnd}
          />
        </div>
      )}

      {phase === 'victory' && selectedLevel && (
        <VictoryScreen
          level={selectedLevel}
          isFinalLevel={selectedLevel.isFinal}
          onNextLevel={selectedLevelId < LEVELS.length ? handleNextLevel : null}
          onReplay={handleReplay}
          onMenu={() => { setPhase('levelSelect'); setLevelId(null) }}
        />
      )}

      {phase === 'defeat' && selectedLevel && (
        <DefeatScreen
          level={selectedLevel}
          onReplay={handleReplay}
          onMenu={() => { setPhase('levelSelect'); setLevelId(null) }}
        />
      )}
    </div>
  )
}
