import { createContext, useContext } from 'react'
import { AuthReducerState, initialState } from './Authenticator.state'

export interface AuthContextType extends AuthReducerState {
  signIn(): void
  signInSilent(): void
  switchUser(nationalId?: string, newLocation?: Location): void
  signOut(): void
}

export const defaultAuthContext = {
  ...initialState,
  dispatch: () => {
    // Intentionally empty
  },
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  switchUser(_nationalId?: string, _newLocation?: Location) {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
