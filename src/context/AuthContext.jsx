// Mocked auth. A real app would call an API here; this one accepts
// any valid-looking form and keeps the session in localStorage.

import { useEffect, useState } from 'react'
import { AuthContext } from './auth'

const STORAGE_KEY = 'chatter.user'

export function AuthProvider({ children }) {
  // user = { name, email } or null when logged out
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

  // Called by the login form; the name is guessed from the email prefix
  function login(email) {
    const name = email.split('@')[0].replace(/[._-]/g, ' ')
    setUser({ name: name || 'Guest', email })
  }

  /** Called by the signup form */
  function signup(name, email) {
    setUser({ name, email })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}