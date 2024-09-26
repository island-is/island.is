import { AuthContext } from '@island.is/auth/react'
import { BffUser, User } from '@island.is/shared/types'
import { useContext } from 'react'
import { BffContext, BffContextType } from './BffContext'
import { createBroadcasterHook } from '@island.is/react-spa/shared'

/**
 * Maps an object to a BffUser type.
 */
export const mapToBffUser = (input: User): BffUser => {
  const {
    profile: {
      sid,
      birthdate,
      nationalId,
      name,
      idp,
      actor,
      subjectType,
      delegationType,
      locale,
    },
    scopes,
  } = input

  // Return a mapped BffUser object
  return {
    scopes: scopes || [],
    profile: {
      sid: sid || '',
      birthdate,
      nationalId,
      name,
      idp,
      actor,
      subjectType,
      delegationType,
      locale,
    },
  }
}

/**
 * Dynamic hook to get the bff context.
 */
export const useDynamicBffHook = (hookName: string): BffContextType => {
  const bffContext = useContext(BffContext)

  if (!bffContext) {
    throw new Error(`${hookName} must be used within a BffProvider`)
  }

  return bffContext
}

/**
 * This hook is used to get the BFF authentication context.
 * It has backward compatibility with AuthContext.
 */
export const useAuth = () => {
  const bffContext = useContext(BffContext)
  const authContext = useContext(AuthContext)

  if (bffContext) {
    return bffContext
  }

  if (authContext) {
    return authContext
  }

  const errorMsg = (providerStr: string) =>
    `useAuth must be used within a ${providerStr}`

  if (!authContext) {
    throw new Error(errorMsg('AuthProvider'))
  }

  throw new Error(errorMsg('BffProvider'))
}

/**
 * This hook is used to get user information.
 * It will determine what context to use based on the context that is available.
 * We will remove support for AuthContext when other clients transition over to BFF.
 * If AuthContext is being used then we will map the user info to the BffUser type.
 */
export const useUserInfo = (): BffUser => {
  const bffContext = useContext(BffContext)
  const authContext = useContext(AuthContext)

  if (bffContext?.userInfo) {
    return bffContext.userInfo
  } else if (authContext?.userInfo) {
    return mapToBffUser(authContext.userInfo)
  }

  throw new Error('User info is not available. Is the user authenticated?')
}

/**
 * This hook is used to get the bff url generator.
 * The bff url generator is used to generate urls for the Bff in a conveinent way.
 */
export const useBffUrlGenerator = () =>
  useDynamicBffHook(useBffUrlGenerator.name).bffUrlGenerator

export const useBff = () => useDynamicBffHook(useBff.name)

export enum BffBroadcastEvents {
  NEW_SESSION = 'NEW_SESSION',
  LOGOUT = 'LOGOUT',
}

type NewSessionEvent = {
  type: BffBroadcastEvents.NEW_SESSION
  userInfo: BffUser
}

type LogoutEvent = {
  type: BffBroadcastEvents.LOGOUT
}

export type BffBroadcastEvent = NewSessionEvent | LogoutEvent

export const useBffBroadcaster =
  createBroadcasterHook<BffBroadcastEvent>('bff_auth_channel')
