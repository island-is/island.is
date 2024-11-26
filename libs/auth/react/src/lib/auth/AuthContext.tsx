import { jwtDecode } from 'jwt-decode'
import { createContext, useContext } from 'react'

import { User } from '@island.is/shared/types'

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
export const useAuth: () => AuthContextType = () => {
  warnDeprecated('useAuth', 'useBff')

  return useContext(AuthContext)
}

/**
 * @deprecated Use useUserInfo from `libs/react-spa/bff` instead.
 */
export const useUserInfo = () => {
  warnDeprecated('useUserInfo', 'useUserInfo')
  const { userInfo } = useContext(AuthContext)

  if (!userInfo) {
    throw new Error('User info is not available. Is the user authenticated?')
  }

  return userInfo
}

/**
 * @deprecated Use useUserInfo from `libs/react-spa/bff` instead where the user info is already decoded.
 */
export const useUserDecodedIdToken = () => {
  warnDeprecated('useUserDecodedIdToken', 'useUserInfo')
  const userInfo = useUserInfo()

  if (!userInfo.id_token) {
    throw new Error(
      'Decoded ID token is not available. Is the user authenticated?',
    )
  }

  return jwtDecode<User['profile']>(userInfo.id_token)
}
