// Mock phone sign-in with an OTP. The code is shown on screen
// because there is no real SMS service.

import { useState } from 'react'
import AuthLayout, { ErrorText } from '../components/AuthLayout'
import { useAuth } from '../hooks/useAuth'

const COUNTRY_CODES = ['+86', '+1', '+44', '+61', '+91', '+81', '+49', '+33', '+7']

export default function LoginPage() {
  const { loginWithPhone } = useAuth()

  // 'number' | 'otp'
  const [step, setStep] = useState('number')

  const [country, setCountry] = useState('+86')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  const [errors, setErrors] = useState({})

  // Send a mock OTP: move to the verify step. Since this is a demo,
  // any 6-digit code is accepted.
  function sendCode(event) {
    event.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 6) {
      setErrors({ phone: 'Enter a valid phone number' })
      return
    }
    setErrors({})
    setCode('')
    setStep('otp')
  }

  function verifyCode(event) {
    event.preventDefault()
    if (code.length === 6) {
      loginWithPhone(`${country}${phone.replace(/\D/g, '')}`)
    } else {
      setErrors({ code: 'Enter the 6-digit code' })
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in with your phone number">
      {step === 'number' ? (
        <form onSubmit={sendCode} className="space-y-4" noValidate>
          <label className="block">
            <span className="text-sm font-medium mb-1.5 block">Phone number</span>
            <div className="flex gap-2">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="field w-24 shrink-0 cursor-pointer"
                aria-label="Country code"
              >
                {COUNTRY_CODES.map((cc) => (
                  <option key={cc} value={cc}>
                    {cc}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                placeholder="Phone number"
                onChange={(e) => setPhone(e.target.value)}
                className={errors.phone ? 'field-error' : 'field'}
              />
            </div>
            {errors.phone && <ErrorText message={errors.phone} />}
          </label>

          <button type="submit" className="btn-primary w-full cursor-pointer">
            Send code
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-4" noValidate>
          <label className="block">
            <span className="text-sm font-medium mb-1.5 block">
              Code sent to {country}
              {phone.replace(/\D/g, '')}
            </span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="······"
              className={
                errors.code
                  ? 'field-error text-center font-mono text-lg tracking-[0.4em]'
                  : 'field text-center font-mono text-lg tracking-[0.4em]'
              }
            />
            {errors.code && <ErrorText message={errors.code} />}
          </label>

          <div className="flex items-center justify-between text-sm pt-1">
            <button
              type="button"
              onClick={() => setStep('number')}
              className="text-slate hover:text-ink transition-colors cursor-pointer"
            >
              Edit number
            </button>
            <button
              type="button"
              onClick={sendCode}
              className="text-cobalt hover:underline cursor-pointer"
            >
              Resend code
            </button>
          </div>

          <button type="submit" className="btn-primary w-full cursor-pointer">
            Verify and log in
          </button>

          {/* demo hint: any 6-digit code works */}
          <p className="rounded-lg bg-mint/10 border border-mint/20 px-3 py-2 text-xs text-ink text-center font-mono">
            DEMO - any 6-digit code works
          </p>
        </form>
      )}
    </AuthLayout>
  )
}