import { useState, useEffect } from 'react'
import ChoiceButton from './ChoiceButton'

const PLACEHOLDER = 'Imagen pendiente'

const CSS = `
  .novel-wrap {
    position: absolute;
    inset: 0;
  }
  .novel-imgwrap {
    position: absolute;
    inset: 0;
  }

  /* Gradient: only bottom 38% darkened for text readability */
  .novel-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
      rgba(0,0,0,0.82) 0%,
      rgba(0,0,0,0.55) 18%,
      rgba(0,0,0,0.15) 35%,
      transparent 50%
    );
    pointer-events: none;
  }

  /* Bottom panel: no background, floats over image */
  .novel-bottom {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 16px;
    padding: 0 clamp(16px, 3vw, 32px) clamp(20px, 3.5vh, 32px);
  }

  /* Text: no box, just shadow */
  .novel-textbox {
    flex: 0 1 540px;
    min-width: 0;
  }
  .novel-title {
    margin: 0 0 6px 0;
    font-size: clamp(0.72rem, 1.5vw, 0.85rem);
    font-weight: 700;
    color: rgba(230,210,165,1);
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-shadow: 0 0 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1), 0 2px 16px rgba(0,0,0,0.9);
  }
  .novel-text {
    margin: 0;
    font-size: clamp(0.82rem, 1.6vw, 0.95rem);
    color: rgba(235,225,210,0.97);
    font-family: Georgia, "Times New Roman", serif;
    line-height: 1.7;
    white-space: pre-line;
    text-shadow: 0 0 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.95);
  }
  .novel-choices {
    flex-shrink: 0;
    width: clamp(180px, 26vw, 290px);
    display: flex;
    flex-direction: column;
    padding-bottom: 2px;
  }

  /* Portrait mobile: column — image on top, text below */
  @media (max-width: 640px) and (orientation: portrait) {
    .novel-wrap {
      display: flex;
      flex-direction: column;
    }
    .novel-imgwrap {
      position: relative;
      flex: 1;
      min-height: 0;
    }
    .novel-gradient {
      background: linear-gradient(to top,
        rgba(0,0,0,0.6) 0%,
        transparent 40%
      );
    }
    .novel-bottom {
      position: relative;
      flex-shrink: 0;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      padding: 14px 16px 18px;
      background: rgba(4,3,8,0.96);
      border-top: 1px solid rgba(220,200,160,0.1);
      max-height: 46vh;
      overflow-y: auto;
    }
    .novel-textbox {
      flex: none;
      width: 100%;
    }
    .novel-title {
      text-shadow: none;
    }
    .novel-text {
      text-shadow: none;
    }
    .novel-choices {
      width: 100%;
    }
  }
`

export default function Scene({ scene, onChoice, fadeIn }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => { setImgError(false) }, [scene.id])

  return (
    <div
      className="novel-wrap"
      style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.55s ease' }}
    >
      <style>{CSS}</style>

      {/* Image */}
      <div className="novel-imgwrap">
        {!imgError ? (
          <img
            src={scene.image}
            alt=""
            onError={() => setImgError(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'brightness(0.92)',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, #0d0c10 0%, #1a1520 40%, #0a0a0e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'rgba(220,200,160,0.2)', fontSize: '0.85rem', fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}>
              {PLACEHOLDER}
            </span>
          </div>
        )}

        <div className="novel-gradient" aria-hidden="true" />

        {/* Act label */}
        {scene.act && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              zIndex: 10,
              fontSize: 'clamp(0.58rem, 1.4vw, 0.68rem)',
              letterSpacing: '0.24em',
              color: 'rgba(220,200,160,0.7)',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              textShadow: '0 1px 8px rgba(0,0,0,1)',
            }}
          >
            {scene.act}
          </div>
        )}
      </div>

      {/* Bottom: text + choices floating over image */}
      <div className="novel-bottom">
        <div className="novel-textbox">
          <p className="novel-title">{scene.title}</p>
          <p className="novel-text">{scene.text}</p>
        </div>

        {scene.choices.length > 0 && (
          <div className="novel-choices">
            {scene.choices.map((choice, i) => (
              <ChoiceButton
                key={choice.next}
                label={choice.label}
                index={i}
                onClick={() => onChoice(choice.next)}
              />
            ))}
          </div>
        )}

        {scene.choices.length === 0 && (
          <div
            style={{
              paddingBottom: '4px',
              alignSelf: 'flex-end',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(220,200,160,0.6)',
                textShadow: '0 1px 6px rgba(0,0,0,1)',
              }}
            >
              {scene.endType === 'bueno'   && 'Fin — El detective triunfa'}
              {scene.endType === 'malo'    && 'Fin — El lobo gana'}
              {scene.endType === 'secreto' && 'Fin secreto — La verdad'}
              {!scene.endType              && 'Fin'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
