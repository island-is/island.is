import { AuthDelegationType } from '@island.is/shared/types'
import { Features } from '@island.is/feature-flags'

export type AllowedDelegation = {
  type: AuthDelegationType
  featureFlag?: Features
}
