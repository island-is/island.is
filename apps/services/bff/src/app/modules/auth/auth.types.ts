import { IdTokenClaims } from '@island.is/shared/types'

import { TokenResponse } from '../ids/ids.types'

export type CachedTokenResponse = Omit<
  TokenResponse,
  'refresh_token' | 'access_token'
> & {
  scopes: string[]

  /**
   * Decoded id token claims
   */
  userProfile: IdTokenClaims

  /**
   * Expiration time of the access token
   */
  accessTokenExp: number

  encryptedAccessToken: string
  encryptedRefreshToken: string
}
