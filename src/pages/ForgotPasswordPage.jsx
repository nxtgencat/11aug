// Mock reset flow: enter an email, get a success screen.
// Nothing is actually sent.

import { useState } from 'react'
import { Check } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { ErrorText } from '../components/PasswordField'
import { isValidEmail } from '../utils/validation'

export default function ForgotPasswordPage({ onShowLogin }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !isValidEmail(email)) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We will email you a reset link">
      {sent ? (
        // success state, mint check marker per the design system
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-mint/15 text-mint grid place-content-center mx-auto">
            <Check className="w-5 h-5" />
          </div>
          <p className="mt-4 text-sm font-medium">Check your inbox</p>
          <p className="mt-1 text-sm text-slate">
            A reset link is on its way to <span className="font-medium text-ink">{email}</span>
          </p>
          <button type="button" onClick={onShowLogin} className="btn-secondary mt-6 cursor-pointer">
            Back to login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block">
            <span className="text-sm font-medium mb-1.5 block">Email</span>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className={error ? 'field-error' : 'field'}
            />
            {error && <ErrorText message={error} />}
          </label>

          <button type="submit" className="btn-primary w-full cursor-pointer">
            Send reset link
          </button>
        </form>
      )}

      {!sent && (
        <p className="mt-5 pt-5 border-t border-line text-center text-sm">
          <button
            type="button"
            onClick={onShowLogin}
            className="text-cobalt font-medium hover:underline cursor-pointer"
          >
            Back to login
          </button>
        </p>
      )}
    </AuthLayout>
  )
}