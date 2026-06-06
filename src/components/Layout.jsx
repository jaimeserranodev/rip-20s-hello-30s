/**
 * Layout wrapper con fondo arcade y barra superior opcional.
 */
export default function Layout({ children, title, onBack, className = '' }) {
  return (
    <div
      className={`min-h-dvh w-full flex flex-col ${className}`}
      style={{ background: 'linear-gradient(180deg, #08080f 0%, #12121e 100%)' }}
    >
      {/* Header */}
      {(title || onBack) && (
        <header
          className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3"
          style={{
            background: 'rgba(8,8,15,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className="btn-arcade btn-ghost rounded-xl px-4 py-2 text-sm font-body font-bold flex items-center gap-2"
              aria-label="Volver al menú"
            >
              ← Menú
            </button>
          )}
          {title && (
            <h1
              className="font-arcade text-2xl md:text-3xl glow-pink m-0"
              style={{ color: '#ff2d78' }}
            >
              {title}
            </h1>
          )}
        </header>
      )}

      {/* Content */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}
