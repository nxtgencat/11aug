// Centered card shell for the auth pages
import Logo from './Logo'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-dvh grid place-items-center bg-paper p-4 relative overflow-hidden">
      {/* soft background blobs, colors from the design system */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cobalt/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fadeUp">
        {/* brand + heading */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showName={false} />
          <h1 className="mt-4 font-display font-semibold text-2xl tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate">{subtitle}</p>
        </div>

        <div className="card border border-line">{children}</div>
      </div>
    </div>
  )
}

// Inline form error: rose text with an alert icon
export function ErrorText({ message }) {
  return (
    <span className="text-xs text-rose mt-1.5 flex items-center gap-1">
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </span>
  )
}