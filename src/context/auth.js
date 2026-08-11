// The context object lives in its own file so AuthContext.jsx only
// exports the provider component.
import { createContext } from 'react'

export const AuthContext = createContext(null)