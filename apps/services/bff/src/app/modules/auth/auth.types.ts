import { IdTokenClaims } from '@island.is/shared/types'

import { TokenResponse } from '../ids/ids.types'

export type CachedTokenResponse = Omit<TokenResponse, 'scope'> & {
  scopes: string[]
  /**
   * Decoded id token claims
   */
  userProfile: IdTokenClaims
}
