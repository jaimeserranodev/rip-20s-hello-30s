import { useRef, useState, useEffect } from 'react'
import useTetrisGame from '../hooks/useTetrisGame'
import TetrisBoard from './TetrisBoard'
import NextPiece from './NextPiece'
import GameStats from './GameStats'
import Confetti from './Confetti'

const MUSIC_SRC = `${import.meta.env.BASE_URL}music/dani treinta y bien.mpeg`

function useGameMusic(started, gameOver, victory) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)

  // Create audio element once
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  // Play/pause based on game state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (started && !gameOver && !victory) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [started, gameOver, victory])

  // Sync mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  return { muted, toggleMute: () => setMuted(m => !m) }
}

function useTouchHold(action, repeatMs = 120) {
  const tid = useRef(null)
  return {
    onTouchStart: e => { e.preventDefault(); action(); tid.current = setInterval(action, repeatMs) },
    onTouchEnd:   () => clearInterval(tid.current),
    onTouchCancel:() => clearInterval(tid.current),
  }
}

function TouchBtn({ label, onTouchStart, onTouchEnd, onTouchCancel, onClick, wide }) {
  return (
    <button
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      onClick={onClick}
      style={{
        width: wide ? '72px' : '54px', height: '54px',
        fontSize: '1.3rem',
        background: 'rgba(0,212,255,0.08)',
        border: '1px solid rgba(0,212,255,0.3)',
        borderRadius: '12px', color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        userSelect: 'none', WebkitTapHighlightColor: 'transparent',
        touchAction: 'none', fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )
}

const OVERLAY_BASE = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.88)', padding: '16px', gap: '12px',
}

const CSS = `
  .dt-board {
    width: min(260px, calc(100vw - 108px - 28px));
    aspect-ratio: 1/2;
    position: relative;
    flex-shrink: 0;
  }
  .dt-panel {
    width: 90px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .dt-next { width: 72px; height: 72px; }
  .dt-touch { display: flex; }
  .dt-kbd   { display: block; }

  @media (min-width: 700px) {
    .dt-board {
      /* Height-driven: board fills available vertical space */
      width: auto;
      height: min(700px, calc(100dvh - 130px));
      aspect-ratio: 1/2;
    }
    .dt-panel  { width: 140px; gap: 12px; }
    .dt-next   { width: 112px; height: 112px; }
    .dt-touch  { display: none; }
    .dt-kbd    { display: block; }
  }

  @media (min-width: 1100px) {
    .dt-board {
      height: min(800px, calc(100dvh - 120px));
    }
    .dt-panel { width: 160px; }
    .dt-next  { width: 128px; height: 128px; }
  }
`

export default function DaniTetris({ onBack }) {
  const game = useTetrisGame()
  const { muted, toggleMute } = useGameMusic(game.started, game.gameOver, game.victory)

  const leftHold  = useTouchHold(() => game.move(-1))
  const rightHold = useTouchHold(() => game.move(1))
  const downHold  = useTouchHold(game.softDrop, 80)

  const isOver    = game.gameOver && !game.victory
  const showStart = !game.started && !game.gameOver

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#08080f 0%,#12121e 100%)', display: 'flex', flexDirection: 'column' }}>
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 16px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
      }}>
        <button
          className="btn-arcade btn-ghost rounded-xl px-3 py-1 font-body font-bold"
          style={{ fontSize: '0.85rem' }}
          onClick={onBack}
        >
          ← Volver
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 className="font-arcade m-0" style={{ fontSize: 'clamp(1.4rem,5vw,2.4rem)', color: '#ff2d78', textShadow: '0 0 20px #ff2d78aa' }}>
            DANI-TRIS
          </h1>
        </div>
        <button
          onClick={toggleMute}
          title={muted ? 'Activar música' : 'Silenciar música'}
          style={{
            width: '38px', height: '38px',
            background: muted ? 'rgba(255,255,255,0.06)' : 'rgba(0,212,255,0.12)',
            border: `1px solid ${muted ? 'rgba(255,255,255,0.15)' : 'rgba(0,212,255,0.4)'}`,
            borderRadius: '10px', cursor: 'pointer',
            color: muted ? 'rgba(255,255,255,0.35)' : '#00d4ff',
            fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* ── Game area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 12px', gap: '10px' }}>
        <p className="font-body" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: 0, textAlign: 'center' }}>
          Encaja a Dani antes de que lleguen los 30.
        </p>

        {/* Board + side panel */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>

          {/* ── Board ── */}
          <div className="dt-board">
            <TetrisBoard board={game.board} current={game.current} ghost={game.ghost} />

            {showStart && (
              <div style={OVERLAY_BASE}>
                <p className="font-arcade glow-pink" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', margin: 0 }}>DANI-TRIS</p>
                <p className="font-body" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
                  ← → Mover · ↑ Rotar · ↓ Bajar · Espacio Caída
                </p>
                <button className="btn-arcade btn-cyan rounded-2xl px-8 py-3 font-body font-black" style={{ fontSize: '1.1rem' }} onClick={game.startGame}>
                  ▶ JUGAR
                </button>
              </div>
            )}

            {isOver && (
              <div style={OVERLAY_BASE}>
                <p className="font-arcade glow-pink" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: 0 }}>GAME OVER</p>
                <p className="font-body" style={{ color: '#ffd700', fontSize: '1rem', margin: 0 }}>
                  {game.score.toLocaleString()} pts
                </p>
                <button className="btn-arcade btn-primary rounded-2xl px-6 py-3 font-body font-black" style={{ fontSize: '1rem' }} onClick={game.startGame}>
                  🔄 Reintentar
                </button>
              </div>
            )}

            {game.victory && (
              <>
                <Confetti />
                <div style={{ ...OVERLAY_BASE, background: 'rgba(0,0,0,0.92)', border: '2px solid rgba(57,255,20,0.5)' }}>
                  <p className="font-arcade" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#39ff14', textShadow: '0 0 20px #39ff14', margin: 0 }}>¡VICTORIA!</p>
                  <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                    Has encajado a Dani en los 30.
                  </p>
                  <p className="font-arcade" style={{ color: '#ffd700', fontSize: '1.1rem', margin: 0 }}>{game.score.toLocaleString()} pts</p>
                  <button className="btn-arcade btn-green rounded-2xl px-6 py-3 font-body font-black" style={{ fontSize: '0.95rem' }} onClick={game.startGame}>
                    🔄 Otra vez
                  </button>
                </div>
              </>
            )}

            {game.paused && !isOver && !game.victory && (
              <div style={OVERLAY_BASE}>
                <p className="font-arcade glow-yellow" style={{ fontSize: 'clamp(2rem,5vw,3rem)', margin: 0 }}>PAUSA</p>
                <button className="btn-arcade btn-yellow rounded-2xl px-6 py-2 font-body font-black" onClick={game.togglePause}>
                  ▶ Reanudar
                </button>
              </div>
            )}

            {game.lineMsg && (
              <div style={{
                position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
                padding: '6px 12px',
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,215,0,0.5)',
                borderRadius: '8px', whiteSpace: 'nowrap', zIndex: 10,
              }}>
                <p className="font-body font-bold" style={{ color: '#ffd700', margin: 0, fontSize: '0.72rem' }}>{game.lineMsg}</p>
              </div>
            )}
          </div>

          {/* ── Side panel ── */}
          <div className="dt-panel">
            <div className="glass rounded-xl p-2" style={{ textAlign: 'center' }}>
              <p className="font-body m-0" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '6px' }}>NEXT</p>
              <div className="dt-next" style={{ margin: '0 auto' }}>
                <NextPiece piece={game.next} />
              </div>
            </div>

            <GameStats score={game.score} lines={game.lines} level={game.level} />

            {game.started && !game.gameOver && !game.victory && (
              <button
                className="btn-arcade btn-ghost rounded-xl py-2 font-body font-bold"
                style={{ fontSize: '0.78rem' }}
                onClick={game.togglePause}
              >
                {game.paused ? '▶ Reanudar' : '⏸ Pausa'}
              </button>
            )}
          </div>
        </div>

        {/* ── Touch controls (mobile only) ── */}
        <div className="dt-touch" style={{ gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <TouchBtn label="◀" {...leftHold} onClick={() => game.move(-1)} />
          <TouchBtn label="↻" onTouchStart={e => { e.preventDefault(); game.rotate() }} onTouchEnd={() => {}} onTouchCancel={() => {}} onClick={game.rotate} />
          <TouchBtn label="▶" {...rightHold} onClick={() => game.move(1)} />
          <TouchBtn label="▼" {...downHold} onClick={game.softDrop} />
          <TouchBtn label="⬇" wide onTouchStart={e => { e.preventDefault(); game.hardDrop() }} onTouchEnd={() => {}} onTouchCancel={() => {}} onClick={game.hardDrop} />
        </div>

        <p className="dt-kbd font-body" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', textAlign: 'center', margin: 0 }}>
          ← → Mover · ↑ Rotar · ↓ Bajar · Espacio Caída rápida · P Pausa
        </p>
      </div>
    </div>
  )
}
