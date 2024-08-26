import { requiredString } from '../utils/env'
import type { BffEnvironmentSchema } from './environment.schema'

export const isProduction = process.env.NODE_ENV === 'production'
const port = parseInt(process.env.PORT as string, 10) || 4444

export const environment: BffEnvironmentSchema = {
  production: isProduction,
  audit: {
    groupName: requiredString('AUDIT_GROUP_NAME'),
    defaultNamespace: '@island.is/bff',
    serviceName: 'services-bff',
  },
  port,
  auth: {
    issuer: requiredString('IDENTITY_SERVER_ISSUER_URL'),
    audience: ['@admin.island.is'],
    clientId: requiredString('IDENTITY_SERVER_CLIENT_ID'),
    scopes: JSON.parse(requiredString('IDENTITY_SERVER_CLIENT_SCOPES') ?? []),
  },
}
