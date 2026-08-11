// ============================================================
// LoginPage.jsx — mocked login form with client-side validation
// ============================================================

import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import PasswordField, { ErrorText } from '../components/PasswordField'
import { isValidEmail } from '../utils/validation'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage({ onShowSignup, onShowForgot }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  /** Validate the form; if it's clean, mock-login succeeds immediately */
  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address'

    if (!password) nextErrors.password = 'Password is required'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) login(email.trim())
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to your chats">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">Email</span>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'field-error' : 'field'}
          />
          {errors.email && <ErrorText message={errors.email} />}
        </label>

        {/* Password */}
        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="At least 6 characters"
        />

        <div className="text-right pt-1">
          <button
            type="button"
            onClick={onShowForgot}
            className="text-sm text-cobalt hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn-primary w-full cursor-pointer">
          Log in
        </button>
      </form>

      {/* Demo hint */}
      <p className="mt-5 text-center font-mono text-[11px] tracking-widest text-slate">
        DEMO — any email · password 6+ chars
      </p>

      <p className="mt-5 pt-5 border-t border-line text-center text-sm text-slate">
        New here?{' '}
        <button
          type="button"
          onClick={onShowSignup}
          className="text-cobalt font-medium hover:underline cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </AuthLayout>
  )
}