import { useState } from 'react'
import { quizQuestions } from '../data/quiz'
import { markCompleted } from '../utils/storage'
import Layout from './Layout'
import Confetti from './Confetti'

const FEEDBACK_WRONG = [
  "Hmm... ¿seguro que conoces a Dani? 🤔",
  "¡Eso era una trampa! ...O no 😅",
  "Error 404: respuesta correcta no encontrada 🤖",
  "Dani desaprueba esta respuesta 👎",
  "Eso suena a alguien que no ha prestado atención 😂",
]

function getWrongFeedback() {
  return FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)]
}

function getRating(score, total) {
  const pct = score / total
  if (pct === 1)   return { emoji: '🏆', label: 'PERFECTO', color: '#ffd700', msg: '¡Eres el experto definitivo en Dani!' }
  if (pct >= 0.75) return { emoji: '🥇', label: 'EXPERTO',  color: '#39ff14', msg: '¡Conoces muy bien al cumpleañero!' }
  if (pct >= 0.5)  return { emoji: '🥈', label: 'APROBADO', color: '#00d4ff', msg: 'Bien, pero podrías conocerle mejor 😄' }
  return              { emoji: '💀', label: '¿QUÉ?',     color: '#ff4444', msg: '¿Estás seguro de que conoces a Dani? 😂' }
}

/** Pantalla de resultado final */
function ResultScreen({ score, total, onBack, onReplay }) {
  const rating = getRating(score, total)

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4 text-center"
      style={{ background: 'rgba(8,8,15,0.95)' }}
    >
      {score === total && <Confetti />}
      <div
        className="glass-strong rounded-3xl p-8 md:p-12 max-w-lg w-full animate-bounce-in"
        style={{ border: `2px solid ${rating.color}44`, position: 'relative', zIndex: 1 }}
      >
        <div style={{ fontSize: '4rem' }}>{rating.emoji}</div>
        <h2
          className="font-arcade mt-2 mb-1"
          style={{
            fontSize: 'clamp(2rem, 7vw, 3rem)',
            color: rating.color,
            textShadow: `0 0 20px ${rating.color}88`,
          }}
        >
          {rating.label}
        </h2>
        <p className="font-body text-base" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
          {rating.msg}
        </p>

        <div
          className="glass rounded-2xl p-5 mb-6"
          style={{ border: `1px solid ${rating.color}33` }}
        >
          <p className="font-body text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Resultado</p>
          <p
            className="font-arcade"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: rating.color }}
          >
            {score} <span style={{ fontSize: '0.5em', color: 'rgba(255,255,255,0.4)' }}>/ {total}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button className="btn-arcade btn-primary rounded-2xl py-3 font-body font-black text-lg" onClick={onReplay}>
            🔄 Repetir quiz
          </button>
          <button className="btn-arcade btn-ghost rounded-2xl py-3 font-body font-bold text-base" onClick={onBack}>
            ← Volver al menú
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuizGame({ onBack }) {
  const [current, setCurrent]       = useState(0)
  const [score, setScore]           = useState(0)
  const [selected, setSelected]     = useState(null)   // índice opción seleccionada
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished]     = useState(false)

  const q = quizQuestions[current]
  const total = quizQuestions.length

  function handleAnswer(optionIndex) {
    if (showFeedback) return
    setSelected(optionIndex)
    setShowFeedback(true)
    if (optionIndex === q.correct) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (current + 1 >= total) {
      markCompleted('quiz')
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowFeedback(false)
    }
  }

  function handleReplay() {
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setShowFeedback(false)
    setFinished(false)
  }

  const isCorrect = selected === q?.correct

  return (
    <Layout title="🧠 Quiz de Dani" onBack={onBack}>
      {finished && (
        <ResultScreen
          score={score}
          total={total}
          onBack={onBack}
          onReplay={handleReplay}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Progreso */}
        <div className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Pregunta {current + 1} de {total}
            </span>
            <span className="font-arcade text-base" style={{ color: '#00d4ff' }}>
              {score} ⭐
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((current) / total) * 100}%` }} />
          </div>
        </div>

        {/* Tarjeta de pregunta */}
        <div
          key={current}
          className="glass-strong rounded-3xl p-6 md:p-8 mb-6 animate-slide-up"
          style={{ border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <p
            className="font-body font-bold text-xs uppercase tracking-widest mb-4"
            style={{ color: '#00d4ff' }}
          >
            ¿Qué harías tú siendo Dani?
          </p>
          <h2
            className="font-body font-black text-xl md:text-2xl m-0 leading-snug"
            style={{ color: 'white' }}
          >
            {q.question}
          </h2>
        </div>

        {/* Opciones */}
        <div className="flex flex-col gap-3 mb-6">
          {q.options.map((opt, i) => {
            const isSelected = selected === i
            const isRight = i === q.correct

            let bg = 'rgba(255,255,255,0.04)'
            let border = '1px solid rgba(255,255,255,0.1)'
            let color = 'rgba(255,255,255,0.85)'
            let icon = null

            if (showFeedback) {
              if (isRight) {
                bg = 'rgba(57,255,20,0.12)'
                border = '1px solid #39ff1466'
                color = '#39ff14'
                icon = '✓'
              } else if (isSelected && !isRight) {
                bg = 'rgba(255,68,68,0.12)'
                border = '1px solid #ff444466'
                color = '#ff7777'
                icon = '✗'
              }
            }

            return (
              <button
                key={i}
                className="w-full text-left rounded-2xl p-4 font-body font-bold text-base transition-all duration-200"
                style={{
                  background: isSelected && !showFeedback ? 'rgba(139,92,246,0.2)' : bg,
                  border: isSelected && !showFeedback ? '1px solid rgba(139,92,246,0.5)' : border,
                  color,
                  cursor: showFeedback ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
              >
                <span
                  className="font-arcade flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm"
                  style={{
                    background: showFeedback && isRight ? '#39ff14' : showFeedback && isSelected ? '#ff4444' : 'rgba(255,255,255,0.1)',
                    color: showFeedback && (isRight || isSelected) ? '#08080f' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {icon || String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Feedback y siguiente */}
        {showFeedback && (
          <div className="animate-slide-up">
            <div
              className="rounded-2xl p-4 mb-4 text-center"
              style={{
                background: isCorrect ? 'rgba(57,255,20,0.1)' : 'rgba(255,68,68,0.1)',
                border: `1px solid ${isCorrect ? '#39ff1444' : '#ff444444'}`,
              }}
            >
              <p
                className="font-body font-black text-base"
                style={{ color: isCorrect ? '#39ff14' : '#ff7777' }}
              >
                {isCorrect ? '🎉 ' + q.feedback : '😅 ' + getWrongFeedback()}
              </p>
              {!isCorrect && (
                <p className="font-body text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  La respuesta era: <strong style={{ color: '#39ff14' }}>{q.options[q.correct]}</strong>
                </p>
              )}
            </div>
            <button
              className="btn-arcade btn-primary w-full rounded-2xl py-3 font-body font-black text-lg"
              onClick={handleNext}
            >
              {current + 1 >= total ? '🏁 Ver resultado' : 'Siguiente pregunta →'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
