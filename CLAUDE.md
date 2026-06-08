# CLAUDE.md — web-dani (Birthday Arcade for Dani's 30th)

## Proyecto
Web-regalo arcade para el 30 cumpleaños de Dani. React + Vite + Tailwind v4. Sin backend. Deploy en GitHub Pages.

**URL prod:** `https://jaimeserranodev.github.io/rip-20s-hello-30s/`
**Repo:** `jaimeserranodev/rip-20s-hello-30s`

## Comandos
```
npm run dev      # localhost:5173
npm run build    # dist/
git push         # CI despliega automáticamente
```

## Arquitectura
```
src/
  App.jsx               # Router de estado (screen: home|menu|memory|quiz|roulette|boss|tactics|tetris)
                        # También gestiona música persistente (mastodonte.mpeg)
  components/
    Home.jsx            # Pantalla de entrada — onEnter dispara música + navega a menu
    GameMenu.jsx        # Grid de juegos (GAMES array) + barra de progreso
    MemoryGame.jsx      # 12 parejas de cartas con flip 3D
    QuizGame.jsx        # 8 preguntas sobre Dani
    RouletteGame.jsx    # Ruleta SVG con 15 retos
    BossFinal.jsx       # Boss fight + CardGallery al ganar
    CardGallery.jsx     # Grid de las 12 cartas
    DaniTetris.jsx      # Tetris con música propia (dani treinta y bien.mpeg)
    TacticsGame.jsx     # Re-export de tactics/TacticsGame
    Layout.jsx          # Header sticky con back button
    Confetti.jsx        # 80 piezas CSS animadas
    GameStats.jsx       # Score/Líneas/Nivel para Tetris
    NextPiece.jsx       # Preview pieza siguiente (Tetris)
    TetrisBoard.jsx     # Tablero 10×20
    TetrisCell.jsx      # Celda individual con imagen
    tactics/            # 9 componentes del juego TFT
  data/
    cards.js            # 12 cartas → public/cards/card-N.jpeg + back-card.jpeg
    units.js            # 11 unidades TFT → public/units/N.png
    tetrisPieces.js     # 7 piezas → public/tetris/N.png (1-28)
    quiz.js             # 8 preguntas
    challenges.js       # 15 retos ruleta
    enemies.js          # 5 niveles enemigos TFT
    synergies.js        # Sinergias TFT
  hooks/
    useTetrisGame.js    # Toda la lógica del Tetris (stateRef pattern)
  utils/
    storage.js          # localStorage: memoryCompleted|quizCompleted|rouletteCompleted|danitrisCompleted
    tetrisUtils.js      # rotateCW, isValid, placePiece, clearLines, calcScore
    combatEngine.js     # Simulación de batalla TFT
    synergyEngine.js    # Cálculo de sinergias TFT
  index.css             # Tailwind v4 + tokens @theme + keyframes + clases arcade
```

## Convenciones críticas
- **BASE_URL**: SIEMPRE usar `import.meta.env.BASE_URL` para rutas a `public/`. Sin esto → 404 en GitHub Pages.
- **Tailwind v4**: `@import "tailwindcss"` (sin config file). Tokens en `@theme {}`.
- **Router**: Solo `useState` en App.jsx, sin react-router.
- **No hay backend**: Todo es estático.
- **Música**:
  - `mastodonte.mpeg` → arranca en clic "Entrar", persiste en App.jsx, pausa en pantalla tetris
  - `dani treinta y bien.mpeg` → solo en DaniTetris, gestiona useTetrisGame

## Assets en public/
```
public/cards/card-1.jpeg … card-12.jpeg + back-card.jpeg
public/units/[nombre]tft.png  (11 archivos)
public/tetris/1.png … 28.png
public/music/mastodonte.mpeg + dani treinta y bien.mpeg
```

## Estado actual (2026-06-08)
- ✅ Todos los juegos funcionan
- ✅ Música persistente + mute
- ✅ Deploy en GitHub Pages operativo
- ✅ Imágenes con BASE_URL corregido

## Tareas pendientes
- Ninguna conocida
