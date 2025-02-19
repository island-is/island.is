import { createBroadcasterHook } from '@island.is/react-spa/shared'
import { BffUser } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import * as kennitala from 'kennitala'
import { useContext, useMemo } from 'react'
import { BffContext, BffContextType } from './BffContext'

/**
 * This hook is used to get the BFF authentication context.
 */
export const useAuth = () => {
  const bffContext = useContext(BffContext)

  if (!bffContext) {
    throw new Error('useAuth must be used within a BffProvider')
  }

  return bffContext
}

/**
 * Dynamic hook to get specific key in the bff context.
 */
export const useDynamicBffHook = <Key extends keyof BffContextType>(
  returnField: Key,
): NonNullable<BffContextType[Key]> => {
  const bffContext = useAuth()

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
 * Gets the user's birthday from the nationalId in the user profile.
 *
 * @warning This does not support system nationalId (kerfis kennitala) users.
 * This should be read from the parsed id_token in the /user response, when the IDP adds support for it.
 */
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
  bffBaseUrl: string
}

type LogoutEvent = {
  type: BffBroadcastEvents.LOGOUT
  bffBaseUrl: string
}

export type BffBroadcastEvent = NewSessionEvent | LogoutEvent

export const useBffBroadcaster =
  createBroadcasterHook<BffBroadcastEvent>('bff_auth_channel')
