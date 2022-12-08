import { AuthDelegationType } from '@island.is/auth-nest-tools'

export type AllowedDelegations = {
  type: AuthDelegationType
  featureFlag?: string
}
