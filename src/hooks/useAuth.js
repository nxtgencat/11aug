// ============================================================
// useAuth.js — small hook that gives components access to the
// current user and the login/signup/logout actions
// ============================================================

import { useContext } from 'react'
import { AuthContext } from '../context/auth'

export function useAuth() {
  return useContext(AuthContext)
}