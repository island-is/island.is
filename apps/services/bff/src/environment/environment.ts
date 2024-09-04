import { requiredString, requiredStringArray } from '../utils/env'
import type { BffEnvironmentSchema } from './environment.schema'

export const isProduction = process.env.NODE_ENV === 'production'
const port = parseInt(process.env.PORT as string, 10) || 3333

const callbacksBaseRedirectPath = requiredString('BFF_CALLBACKS_BASE_PATH')
  // Remove trailing slash if present
  .replace(/\/$/, '')

const issuer = requiredString('IDENTITY_SERVER_ISSUER_URL')

export const environment: BffEnvironmentSchema = {
  production: isProduction,
  clientBasePath: requiredString('BFF_CLIENT_BASE_PATH'),
  globalPrefix: requiredString('BFF_API_URL_PREFIX'),
  audit: {
    groupName: requiredString('AUDIT_GROUP_NAME'),
    defaultNamespace: '@island.is/bff',
    serviceName: 'services-bff',
  },
  ...(!isProduction && {
    enableCors: {
      // Allowed origin(s)
      origin: ['http://localhost:4200', issuer],
      methods: ['GET', 'POST'],
      // Allow cookies and credentials to be sent
      credentials: true,
    },
  }),
  port,
  auth: {
    issuer,
    clientId: requiredString('IDENTITY_SERVER_CLIENT_ID'),
    secret: requiredString('IDENTITY_SERVER_CLIENT_SECRET'),
    scopes: requiredStringArray('IDENTITY_SERVER_CLIENT_SCOPES'),
    audience: requiredStringArray('IDENTITY_SERVER_AUDIENCE'),
    allowedRedirectUris: requiredStringArray('BFF_ALLOWED_REDIRECT_URIS'),
    callbacksRedirectUris: {
      login: `${callbacksBaseRedirectPath}/login`,
      logout: `${callbacksBaseRedirectPath}/logout`,
    },
    logoutRedirectUri: requiredString('BFF_LOGOUT_REDIRECT_PATH'),
  },
}
