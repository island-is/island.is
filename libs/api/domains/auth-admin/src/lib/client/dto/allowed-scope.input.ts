import { Environment } from '@island.is/shared/types'

export interface AllowedScopeInput {
  tenantId: string
  clientId: string
  environment: Environment
}
