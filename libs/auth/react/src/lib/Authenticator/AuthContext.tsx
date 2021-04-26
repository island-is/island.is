import { createContext, useContext } from 'react'
import { UserManager } from 'oidc-client'

import { AuthReducerState, initialState } from './Authenticator.state'

export interface AuthContextType extends AuthReducerState {
  signIn: () => void
  signInSilent: () => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn() {},
  signInSilent() {},
  signOut() {},
})

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
