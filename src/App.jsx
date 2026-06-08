import { useState, useEffect, useRef } from 'react'
import Home from './components/Home'
import GameMenu from './components/GameMenu'
import MemoryGame from './components/MemoryGame'
import QuizGame from './components/QuizGame'
import RouletteGame from './components/RouletteGame'
import BossFinal from './components/BossFinal'
import TacticsGame from './components/TacticsGame'
import DaniTetris from './components/DaniTetris'
import NovelGame from './components/NovelGame'

const MUSIC_SRC = `${import.meta.env.BASE_URL}music/mastodonte.mpeg`

function usePersistentMusic(screen) {
  const audioRef  = useRef(null)
  const activeRef = useRef(false)
  const [muted,   setMuted]   = useState(false)
  const [playing, setPlaying] = useState(false) // para re-render del icono

  // Crear el elemento de audio una sola vez
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop   = false
    audio.volume = 0.65
    audioRef.current = audio
    audio.addEventListener('ended', () => {
      activeRef.current = false
      setPlaying(false)
    })
    return () => { audio.pause(); audio.src = '' }
  }, [])

  // Pausar al entrar al Tetris, reanudar al salir
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !activeRef.current) return
    if (screen === 'tetris' || screen === 'novel') {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [screen])

  // Sincronizar mute con el elemento de audio
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  // Llamar esto en el primer clic del usuario (botón "Entrar")
  const startMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.muted = false
    setMuted(false)
    audio.play()
      .then(() => { activeRef.current = true; setPlaying(true) })
      .catch(() => {})
  }

  const toggleMute = () => {
    if (!activeRef.current) {
      // Canción terminada → reiniciar
      startMusic()
      return
    }
    setMuted(m => {
      if (audioRef.current) audioRef.current.muted = !m
      return !m
    })
  }

  const icon  = !playing ? '🎵' : muted ? '🔇' : '🔊'
  const label = !playing ? 'Reproducir música' : muted ? 'Activar música' : 'Silenciar música'
  const lit   = playing && !muted

  return { startMusic, toggleMute, icon, label, lit }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const music = usePersistentMusic(screen)

  const go = (to) => {
    setScreen(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEnter = () => {
    go('menu')
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#08080f' }}>
      {screen === 'home'     && <Home         onEnter={handleEnter} />}
      {screen === 'menu'     && <GameMenu      onNavigate={go} />}
      {screen === 'memory'   && <MemoryGame    onBack={() => go('menu')} onComplete={() => go('menu')} />}
      {screen === 'quiz'     && <QuizGame      onBack={() => go('menu')} onComplete={() => go('menu')} />}
      {screen === 'roulette' && <RouletteGame  onBack={() => go('menu')} onComplete={() => go('menu')} />}
      {screen === 'boss'     && <BossFinal     onBack={() => go('menu')} />}
      {screen === 'tactics'  && <TacticsGame   onBack={() => go('menu')} />}
      {screen === 'tetris'   && <DaniTetris    onBack={() => go('menu')} />}
      {screen === 'novel'    && <NovelGame     onBack={() => go('menu')} />}

      {/* Botón de música — visible en todas las pantallas menos en Tetris y Novel */}
      {screen !== 'tetris' && screen !== 'novel' && (
        <button
          onClick={music.toggleMute}
          aria-label={music.label}
          title={music.label}
          style={{
            position: 'fixed', bottom: '18px', right: '18px', zIndex: 200,
            width: '44px', height: '44px',
            background: music.lit ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${music.lit ? 'rgba(139,92,246,0.55)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '12px', cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: music.lit ? '0 0 14px rgba(139,92,246,0.35)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {music.icon}
        </button>
      )}
    </div>
  )
}
