import { IdTokenClaims } from '@island.is/shared/types'

import { TokenResponse } from '../ids/ids.types'

export type CachedTokenResponse = TokenResponse & {
  scopes: string[]

  /**
   * Decoded id token claims
   */
  userProfile: IdTokenClaims

  /**
   * Expiration time of the access token
   */
  accessTokenExp: number
}
