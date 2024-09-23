import { requiredString, requiredStringArray } from '../utils/env'
import { removeTrailingSlash } from '../utils/removeTrailingSlash'
import type { BffEnvironmentSchema } from './environment.schema'

const isProduction = process.env.NODE_ENV === 'production'
const port = parseInt(process.env.PORT as string, 10) || 3010

const callbacksBaseRedirectPath = removeTrailingSlash(
  requiredString('BFF_CALLBACKS_BASE_PATH'),
)
const issuer = requiredString('IDENTITY_SERVER_ISSUER_URL')
const logoutRedirectUri = requiredString('BFF_LOGOUT_REDIRECT_PATH')

export const environment: BffEnvironmentSchema = {
  production: isProduction,
  globalPrefix: `${requiredString('BFF_CLIENT_BASE_PATH')}/bff`,
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
    logoutRedirectUri,
  },
}
