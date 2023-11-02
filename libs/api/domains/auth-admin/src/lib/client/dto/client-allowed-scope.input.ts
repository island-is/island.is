import { Environment } from '@island.is/shared/types'

export interface ClientAllowedScopeInput {
  tenantId: string
  clientId: string
  environment: Environment
}
