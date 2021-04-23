import { AuthConfig } from '@island.is/auth-nest-tools'

export interface Environment {
  production: boolean
  auth: AuthConfig
  allowedNationalIds: string
}
