import { createContext, useContext } from 'react'

import { AuthReducerState, initialState } from './Authenticator.state'

export interface AuthContextType extends AuthReducerState {
  signIn: () => void
  signInSilent: () => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
})

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
