import { Environment } from '@island.is/shared/types'

export interface ClientSecretInput {
  tenantId: string
  clientId: string
  environment: Environment
}
