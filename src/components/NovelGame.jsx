import { useState, useEffect, useRef, useCallback } from 'react'
import { SCENES, START_SCENE } from '../data/scenes'
import Scene from './Scene'

// Escenas que aportan evidencia real contra el culpable
const EVIDENCE_SCENES = new Set([
  'escena-08', // Irene (barro)
  'escena-09', // Javi (copa servida)
  'escena-11', // Lulu (vio al lobo)
  'escena-12', // María (cartas)
  'escena-14', // pendiente de Iris
  'escena-16', // Jaime (no estaba surfeando)
  'escena-23', // Iris confiesa
  'escena-26', // Jaime confiesa que siguió a alguien
  'escena-27', // mensaje del muerto
  'escena-31', // Iris cuenta todo
])
const EVIDENCE_THRESHOLD = 3

function hasEnoughEvidence(visited) {
  let count = 0
  for (const s of EVIDENCE_SCENES) {
    if (visited.has(s)) count++
  }
  return count >= EVIDENCE_THRESHOLD
}

const MUSIC_SRC = `${import.meta.env.BASE_URL}novel/YTDown_YouTube_Media_qgPSTtl3zOU_009_128k.mp3`

function useNovelMusic() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.volume = 0.45
    audioRef.current = audio
    audio.play().catch(() => {})
    return () => { audio.pause(); audio.src = '' }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  return { muted, toggleMute: () => setMuted(m => !m) }
}

function hasSecretEnding(visited) {
  return visited.has('escena-12') && visited.has('escena-23') &&
    (visited.has('escena-11') || visited.has('escena-29'))
}

function buildChoices(scene, visited) {
  const base = [...scene.choices]
  if (scene.secretChoice && hasSecretEnding(visited)) {
    if (!base.some(c => c.next === scene.secretChoice.next)) {
      base.push(scene.secretChoice)
    }
  }
  return base
}

const BTN = {
  padding: '6px 14px',
  background: 'rgba(5,4,8,0.7)',
  border: '1px solid rgba(220,200,160,0.25)',
  borderRadius: '4px',
  color: 'rgba(220,200,160,0.65)',
  fontSize: '0.78rem',
  cursor: 'pointer',
  letterSpacing: '0.1em',
  fontFamily: 'Georgia, serif',
  transition: 'all 0.18s ease',
}

export default function NovelGame({ onBack }) {
  const [currentId, setCurrentId] = useState(START_SCENE)
  const [visited,   setVisited]   = useState(() => new Set([START_SCENE]))
  const [fadeIn,    setFadeIn]    = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const { muted, toggleMute } = useNovelMusic()

  const goTo = useCallback((nextId) => {
    if (transitioning) return
    // Gate: redirect to dead-end scene if player tries Yeray too early
    const targetId = (nextId === 'escena-25' && !hasEnoughEvidence(visited))
      ? 'escena-25b'
      : nextId
    if (!SCENES[targetId]) return
    setTransitioning(true)
    setFadeIn(false)
    setTimeout(() => {
      setCurrentId(targetId)
      setVisited(v => new Set([...v, targetId]))
      setFadeIn(true)
      setTransitioning(false)
    }, 380)
  }, [transitioning, visited])

  const restart = () => {
    setTransitioning(true)
    setFadeIn(false)
    setTimeout(() => {
      setCurrentId(START_SCENE)
      setVisited(new Set([START_SCENE]))
      setFadeIn(true)
      setTransitioning(false)
    }, 380)
  }

  const scene = SCENES[currentId]
  if (!scene) return null

  const displayScene = { ...scene, choices: buildChoices(scene, visited) }
  const isEnd = scene.isEnd

  useEffect(() => {
    if (isEnd) localStorage.setItem('novelCompleted', 'true')
  }, [isEnd, currentId])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050408', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={BTN}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(220,200,160,1)'; e.currentTarget.style.borderColor = 'rgba(220,200,160,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,200,160,0.65)'; e.currentTarget.style.borderColor = 'rgba(220,200,160,0.25)' }}
        >
          ← Salir
        </button>

        <button
          onClick={toggleMute}
          title={muted ? 'Activar música' : 'Silenciar música'}
          style={{
            ...BTN,
            padding: '6px 10px',
            fontSize: '1rem',
            color: muted ? 'rgba(220,200,160,0.3)' : 'rgba(220,200,160,0.75)',
            borderColor: muted ? 'rgba(220,200,160,0.15)' : 'rgba(220,200,160,0.35)',
          }}
        >
          {muted ? '🔇' : '🎵'}
        </button>
      </div>

      <Scene scene={displayScene} onChoice={goTo} fadeIn={fadeIn} />

      {isEnd && (
        <div style={{ position: 'absolute', bottom: 'clamp(20px,4vh,36px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 30 }}>
          <button
            onClick={restart}
            style={{ ...BTN, padding: '10px 20px', color: 'rgba(220,200,160,0.85)', borderColor: 'rgba(220,200,160,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,200,160,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5,4,8,0.7)' }}
          >
            Empezar de nuevo
          </button>
          <button
            onClick={onBack}
            style={{ ...BTN, padding: '10px 20px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(220,200,160,0.85)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,200,160,0.65)' }}
          >
            Volver al menú
          </button>
        </div>
      )}
    </div>
  )
}
