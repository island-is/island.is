import { AuthDelegationType } from '@island.is/auth-nest-tools'
import { Features } from '@island.is/feature-flags'

export type AllowedDelegation = {
  type: AuthDelegationType
  featureFlag?: Features
}
