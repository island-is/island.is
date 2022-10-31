import { AuthDelegationType } from '@island.is/shared/types'

export type AllowedDelegations = {
  type: AuthDelegationType
  featureFlag?: string
}
