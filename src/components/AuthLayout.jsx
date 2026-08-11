// Centered card shell for the login, signup, and forgot-password pages
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