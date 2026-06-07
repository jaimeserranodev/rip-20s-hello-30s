import { useState } from 'react'
import Home from './components/Home'
import GameMenu from './components/GameMenu'
import MemoryGame from './components/MemoryGame'
import QuizGame from './components/QuizGame'
import RouletteGame from './components/RouletteGame'
import BossFinal from './components/BossFinal'
import TacticsGame from './components/TacticsGame'
import DaniTetris from './components/DaniTetris'

export default function App() {
  const [screen, setScreen] = useState('home')

  const go = (to) => {
    setScreen(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#08080f' }}>
      {screen === 'home'     && <Home         onEnter={() => go('menu')} />}
      {screen === 'menu'     && <GameMenu      onNavigate={go} />}
      {screen === 'memory'   && <MemoryGame    onBack={() => go('menu')} onComplete={() => go('menu')} />}
      {screen === 'quiz'     && <QuizGame      onBack={() => go('menu')} onComplete={() => go('menu')} />}
      {screen === 'roulette' && <RouletteGame  onBack={() => go('menu')} onComplete={() => go('menu')} />}
      {screen === 'boss'     && <BossFinal     onBack={() => go('menu')} />}
      {screen === 'tactics'  && <TacticsGame   onBack={() => go('menu')} />}
      {screen === 'tetris'   && <DaniTetris    onBack={() => go('menu')} />}
    </div>
  )
}
