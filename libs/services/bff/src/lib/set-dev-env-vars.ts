import { adminPortalScopes, servicePortalScopes } from '@island.is/auth/scopes'
import { BffClient, bffClients, ADMIN_PORTAL, SERVICE_PORTAL } from './clients'

/**
 * Set environment variables for local development BFF server, based on bffClient key.
 */
export const setDevEnvVars = (key: BffClient) => {
  const keyPath = bffClients[key]

  // First set the common environment variables
  process.env.AUDIT_GROUP_NAME = '/island-is/audit-log'
  process.env.IDENTITY_SERVER_ISSUER_URL =
    'https://identity-server.dev01.devland.is'
  process.env.IDENTITY_SERVER_AUDIENCE = '["@admin.island.is/bff"]'
  process.env.BFF_PAR_SUPPORT_ENABLED = 'false'
<<<<<<< HEAD
  process.env.BFF_LOGOUT_REDIRECT_PATH = 'http://localhost:4200'
  process.env.BFF_PROXY_API_ENDPOINT = 'http://localhost:4444/api/graphql'
  process.env.BFF_TOKEN_SECRET_BASE64 =
    // This is a valid 32-byte base64 encoded dummy secret.
    // You can generate a new one by running `openssl rand -base64 32`
    'Y0ROrC3mxDBnveN+EpAnLtSubttyjZZWcV43dyk7OQI='
  // This is only needed for local development when proxying requests with the GraphQL API.
=======
  process.env.BFF_LOGOUT_REDIRECT_PATH = 'https://beta.dev01.devland.is'
  process.env.BFF_PROXY_API_ENDPOINT = 'http://localhost:4444/api/graphql'
  process.env.BFF_TOKEN_SECRET_BASE64 =
    // This is a valid 32-byte base64 encoded secret.
    // You can generate a new one by running `openssl rand -base64 32`
    'Y0ROrC3mxDBnveN+EpAnLtSubttyjZZWcV43dyk7OQI='
>>>>>>> 045b0471e1 (Restructure dx for admin portal)
  process.env.BFF_LOCAL_DEVELOPMENT_CORS = 'true'

  process.env.BFF_API_URL_PREFIX = `/${keyPath}/bff`
  process.env.BFF_CLIENT_BASE_PATH = `/${keyPath}`
  process.env.BFF_ALLOWED_REDIRECT_URIS = JSON.stringify([
    `https://*.dev01.devland.is/${keyPath}/bff/*`,
    `https://localhost:4200/${keyPath}/bff/*`,
  ])
  process.env.BFF_ALLOWED_EXTERNAL_API_URLS = JSON.stringify([
    `https://api.${keyPath}.island.is`,
  ])
  process.env.BFF_CALLBACKS_BASE_PATH = `http://localhost:3010/${keyPath}/bff/callbacks`
  process.env.IDENTITY_SERVER_CLIENT_ID = `@admin.island.is/bff-${keyPath}`

  switch (key) {
    case SERVICE_PORTAL:
      process.env.IDENTITY_SERVER_CLIENT_SCOPES =
        JSON.stringify(servicePortalScopes)

      break

    case ADMIN_PORTAL:
      process.env.IDENTITY_SERVER_CLIENT_SCOPES =
        JSON.stringify(adminPortalScopes)

      break

    default:
      throw new Error(
        `Invalid BFF client: ${key}. Please choose one of the following: ${Object.keys(
          bffClients,
        ).join(', ')}`,
      )
  }
}
