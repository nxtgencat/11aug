// ============================================================
// SignupPage.jsx — mocked signup form with client-side validation
// ============================================================

import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import PasswordField, { ErrorText } from '../components/PasswordField'
import { isValidEmail } from '../utils/validation'
import { useAuth } from '../hooks/useAuth'

export default function SignupPage({ onShowLogin }) {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  /** Validate the form; if it's clean, mock-signup succeeds immediately */
  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!name.trim()) nextErrors.name = 'Name is required'
    else if (name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters'

    if (!email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address'

    if (!password) nextErrors.password = 'Password is required'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'

    if (!confirm) nextErrors.confirm = 'Please confirm your password'
    else if (password && confirm !== password) nextErrors.confirm = 'Passwords do not match'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) signup(name.trim(), email.trim())
  }

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full name */}
        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">Full name</span>
          <input
            type="text"
            value={name}
            placeholder="Jordan Lee"
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'field-error' : 'field'}
          />
          {errors.name && <ErrorText message={errors.name} />}
        </label>

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

        {/* Passwords */}
        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="At least 6 characters"
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          placeholder="Repeat your password"
        />

        <button type="submit" className="btn-primary w-full cursor-pointer">
          Create account
        </button>
      </form>

      <p className="mt-5 pt-5 border-t border-line text-center text-sm text-slate">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onShowLogin}
          className="text-cobalt font-medium hover:underline cursor-pointer"
        >
          Log in
        </button>
      </p>
    </AuthLayout>
  )
}