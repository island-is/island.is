import { createContext } from 'react'

import { useBff } from '@island.is/react-spa/bff'

import { AuthReducerState, initialState } from './Auth.state'

export interface AuthContextType extends AuthReducerState {
  signIn(): void
  signInSilent(): void
  switchUser(nationalId?: string): void
  signOut(): void
  authority?: string
}

export const defaultAuthContext = {
  ...initialState,
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  switchUser(_nationalId?: string) {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

const warnDeprecated = (hookName: string, alternative: string) => {
  console.warn(
    `[Deprecation Warning] "${hookName}" is being replaced by BFF auth pattern Please use "${alternative}" from "libs/react-spa/bff".`,
  )
}

/**
 * @deprecated Use useBff from `libs/react-spa/bff` instead.
 */
export const useAuth = () => {
  warnDeprecated('useAuth', 'useBff')

  return useBff()
}

/**
 * @deprecated Use useUserInfo from `libs/react-spa/bff` instead.
 */
export const useUserInfo = () => {
  warnDeprecated('useUserInfo', 'useUserInfo')
  const { userInfo } = useAuth()

  if (!userInfo) {
    throw new Error('User info is not available. Is the user authenticated?')
  }

  return userInfo
}
