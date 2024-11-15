import { AuthContext } from '@island.is/auth/react'
import { createBroadcasterHook } from '@island.is/react-spa/shared'
import { BffUser, User } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import * as kennitala from 'kennitala'
import { useContext, useMemo } from 'react'
import { BffContext, BffContextType } from './BffContext'

/**
 * Maps an object to a BffUser type.
 */
export const mapToBffUser = (input: User, iss?: string): BffUser => {
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
      iss: iss || '',
    },
  }
}

/**
 * This hook is used to get the BFF authentication context.
 */
export const useBff = () => {
  const bffContext = useContext(BffContext)

  if (!bffContext) {
    throw new Error('useBff must be used within a BffProvider')
  }

  return bffContext
}

/**
 * Dynamic hook to get specific key in the bff context.
 */
export const useDynamicBffHook = <Key extends keyof BffContextType>(
  returnField: Key,
): NonNullable<BffContextType[Key]> => {
  const bffContext = useBff()

  if (!isDefined(bffContext[returnField])) {
    throw new Error(`The field ${returnField} does not exist in the BffContext`)
  }

  return bffContext[returnField] as NonNullable<BffContextType[Key]>
}

/**
 * This hook is used to get the bff url generator.
 * The bff url generator is used to generate urls for the Bff in a conveinent way.
 */
export const useBffUrlGenerator = () => useDynamicBffHook('bffUrlGenerator')
export const useUserInfo = () => useDynamicBffHook('userInfo')

/**
 * Legacy hook for retrieving user information across different authentication contexts.
 * @deprecated Use useUserInfo hook directly with BffContext instead
 *
 * This hook provides backwards compatibility during the transition from AuthContext to BffContext.
 * It attempts to retrieve user information in the following order:
 * 1. First tries BffContext (preferred)
 * 2. Falls back to AuthContext (legacy) and maps it to BffUser format
 *
 * @throws {Error} If no user information is available in either context
 * @returns {BffUser} Standardized user information object
 *
 * @example
 * // Instead of:
 * const user = useLegacyUserInfo()
 *
 * // Prefer:
 * const user = useUserInfo()
 */
export const useLegacyUserInfo = (): BffUser => {
  const bffContext = useContext(BffContext)
  const authContext = useContext(AuthContext)

  const mappedAuthUserInfo = useMemo(() => {
    if (authContext.userInfo) {
      return mapToBffUser(authContext.userInfo, authContext?.authority)
    }

    return null
  }, [authContext.userInfo, authContext?.authority])

  if (bffContext?.userInfo) {
    return bffContext.userInfo
  } else if (mappedAuthUserInfo) {
    return mappedAuthUserInfo
  }

  throw new Error('User info is not available. Is the user authenticated?')
}

/**
 * Legacy hook for retrieving authentication context across different providers.
 * @deprecated Use useBff hook directly with BffContext instead
 *
 * This hook provides backwards compatibility during the transition from AuthContext to BffContext.
 * It attempts to retrieve authentication context in the following order:
 * 1. First tries BffContext (preferred)
 * 2. Falls back to AuthContext (legacy)
 *
 * @throws {Error} If neither BffProvider nor AuthProvider is available in the component tree
 * @returns {BffContextType | AuthContext} Authentication context from either provider
 *
 * @example
 * // Instead of:
 * const auth = useLegacyAuth()
 *
 * // Prefer:
 * const auth = useBff()
 */
export const useLegacyAuth = () => {
  const bffContext = useContext(BffContext)
  const authContext = useContext(AuthContext)

  if (bffContext) {
    return bffContext
  }

  if (authContext) {
    return authContext
  }

  const errorMsg = (providerStr: string) =>
    `useLegacyAuth must be used within a ${providerStr}`

  if (!authContext) {
    throw new Error(errorMsg('AuthProvider'))
  }

  throw new Error(errorMsg('BffProvider'))
}

export const useUserBirthday = () => {
  const userInfo = useUserInfo()

  return useMemo(() => {
    const nationalId = userInfo?.profile.nationalId

    return nationalId ? kennitala.info(nationalId)?.birthday : undefined
  }, [userInfo?.profile.nationalId])
}

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
