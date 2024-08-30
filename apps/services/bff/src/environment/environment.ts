import { requiredString, requiredStringArray } from '../utils/env'
import type { BffEnvironmentSchema } from './environment.schema'

export const isProduction = process.env.NODE_ENV === 'production'
const port = parseInt(process.env.PORT as string, 10) || 3333

export const environment: BffEnvironmentSchema = {
  production: isProduction,
  globalPrefix: requiredString('BFF_API_URL_PREFIX'),
  audit: {
    groupName: requiredString('AUDIT_GROUP_NAME'),
    defaultNamespace: '@island.is/bff',
    serviceName: 'services-bff',
  },
  port,
  auth: {
    issuer: requiredString('IDENTITY_SERVER_ISSUER_URL'),
    clientId: requiredString('IDENTITY_SERVER_CLIENT_ID'),
    secret: requiredString('IDENTITY_SERVER_CLIENT_SECRET'),
    scopes: requiredStringArray('IDENTITY_SERVER_CLIENT_SCOPES'),
    audience: requiredStringArray('IDENTITY_SERVER_AUDIENCE'),
    allowedRedirectUris: requiredStringArray('BFF_ALLOWED_REDIRECT_URIS'),
    callbacksLoginRedirectUri: requiredString(
      'BFF_CALLBACKS_LOGIN_REDIRECT_URI',
    ),
  },
}
