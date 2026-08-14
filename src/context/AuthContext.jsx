// Mocked auth. A real app would call an API here; this one accepts
// any valid-looking form and keeps the session in localStorage.

import { useEffect, useState } from 'react'
import { AuthContext } from './auth'

const STORAGE_KEY = 'chatter.user'

export function AuthProvider({ children }) {
  // user = { name, phone } or null when logged out
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
    } catch {
      return null
    }
  })

  // Keep localStorage in sync with state
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Called after a phone number + OTP verification
  function loginWithPhone(phone) {
    setUser({ name: 'Guest', phone })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginWithPhone, logout }}>
      {children}
    </AuthContext.Provider>
  )
}