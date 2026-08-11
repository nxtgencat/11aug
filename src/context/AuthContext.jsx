// ============================================================
// AuthContext.jsx — mocked authentication
//
// A real app would call an API here. For this demo, login and
// signup simply accept any valid-looking form and remember the
// user in localStorage so the session survives a page reload.
// ============================================================

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

  // Keep localStorage in sync whenever the user changes
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  /** Called by the login form. name is derived from the email. */
  function login(email) {
    const name = email.split('@')[0].replace(/[._-]/g, ' ')
    setUser({ name: name || 'Guest', email })
  }

  /** Called by the signup form. */
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