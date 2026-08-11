// Password input with a show/hide toggle, used by the login
// and signup forms.

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ id, label, value, onChange, error, placeholder }) {
  const [show, setShow] = useState(false)

  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium mb-1.5 block">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={error ? 'field-error pr-11' : 'field pr-11'}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full grid place-content-center text-slate hover:text-ink transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <ErrorText message={error} />}
    </label>
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