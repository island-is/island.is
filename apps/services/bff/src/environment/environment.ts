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
    issuer: requiredString('BFF_IDENTITY_SERVER_ISSUER_URL'),
    audience: requiredStringArray('BFF_IDENTITY_SERVER_AUDIENCE'),
    clientId: requiredString('BFF_IDENTITY_SERVER_CLIENT_ID'),
    scopes: requiredStringArray('BFF_IDENTITY_SERVER_CLIENT_SCOPES'),
    allowedRedirectUris: requiredStringArray('BFF_ALLOWED_REDIRECT_URIS'),
    secret: requiredString('BFF_IDENTITY_SERVER_SECRET'),
    callbacksLoginRedirectUri: requiredString('BFF_CALLBACKS_LOGIN_REDIRECT_URI'),
  },
}
