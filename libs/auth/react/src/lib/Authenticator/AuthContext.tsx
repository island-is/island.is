import { createContext, useContext, Dispatch } from 'react'

import type { AuthSettings } from '../AuthSettings'
import { AuthReducerState, initialState, Action } from './Authenticator.state'

export interface AuthContextType extends AuthReducerState {
  signIn(): void
  signInSilent(): void
  switchUser(nationalId?: string): void
  signOut(): void

  dispatch: Dispatch<Action>
  authSettings: AuthSettings
  checkLogin(): Promise<void>
  autoLogin?: boolean
}

export const defaultAuthContext = {
  ...initialState,
  authSettings: {} as AuthSettings,
  autoLogin: undefined,
  dispatch: () => {
    // Intentionally empty
  },
  checkLogin() {
    return Promise.resolve()
    // Intentionally empty
  },
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  switchUser() {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
