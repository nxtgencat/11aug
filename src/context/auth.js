// ============================================================
// authContext.js — the context object itself.
// Kept separate so AuthContext.jsx only exports components
// (which keeps Fast Refresh happy).
// ============================================================

import { createContext } from 'react'

export const AuthContext = createContext(null)