import { BffProfile } from '@island.is/shared/types'

import { TokenResponse } from '../ids/ids.types'

export type CachedTokenResponse = Omit<
  TokenResponse,
  'refresh_token' | 'access_token'
> & {
  scopes: string[]

  /**
   * Decoded id token claims
   */
  userProfile: BffProfile

  /**
   * Expiration time of the access token
   */
  accessTokenExp: number

  encryptedAccessToken: string
  encryptedRefreshToken: string
}

export type LoginAttemptData = {
  targetLinkUri: string
  codeVerifier: string
}
