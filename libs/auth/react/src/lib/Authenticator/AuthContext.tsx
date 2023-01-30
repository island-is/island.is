import { createContext, useContext } from 'react'
import { Location } from 'react-router-dom'
import { AuthReducerState, initialState } from './Authenticator.state'

export interface AuthContextType extends AuthReducerState {
  signIn: () => void
  signInSilent: () => void
  switchUser: (nationalId?: string, location?: Location) => void
  signOut: () => void
}

export const defaultAuthContext = {
  ...initialState,
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  switchUser(nationalId?: string, location?: Location) {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
