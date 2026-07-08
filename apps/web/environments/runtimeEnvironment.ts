import { getClientRuntimeEnv, isServerSide } from '@island.is/shared/utils'

const graphqlPath = '/api/graphql'

/**
 * Replaces `publicRuntimeConfig`/`serverRuntimeConfig` from next.config.js
 * (removed in Next.js 16), keeping the build-once/deploy-everywhere model:
 * values are resolved from process.env at request time on the server, and on
 * the client they are read from the JSON script tag rendered by
 * pages/_document.tsx.
 */

export type PublicRuntimeEnv = ReturnType<typeof buildPublicRuntimeEnv>

/**
 * Values safe to expose to the browser. Only called server-side;
 * the client receives the result via _document.tsx.
 */
export const buildPublicRuntimeEnv = () => {
  const {
    DISABLE_API_CATALOGUE,
    DD_LOGS_CLIENT_TOKEN,
    APP_VERSION,
    ENVIRONMENT,
    MATOMO_SITE_ID,
    MATOMO_DOMAIN,
    MATOMO_ENABLED,
  } = process.env

  return {
    // Will be available on both server and client
    graphqlUrl: '',
    graphqlEndpoint: graphqlPath,
    disableApiCatalog: DISABLE_API_CATALOGUE,
    ddLogsClientToken: DD_LOGS_CLIENT_TOKEN,
    appVersion: APP_VERSION,
    environment: ENVIRONMENT,
    matomoSiteId: MATOMO_SITE_ID,
    matomoDomain: MATOMO_DOMAIN,
    isMatomoEnabled: MATOMO_ENABLED === 'true',
  }
}

/**
 * Isomorphic access to the public runtime environment.
 */
export const getPublicRuntimeEnv = (): PublicRuntimeEnv =>
  isServerSide()
    ? buildPublicRuntimeEnv()
    : (getClientRuntimeEnv() as unknown as PublicRuntimeEnv)

/**
 * Server-only values. Never serialized to the client.
 */
export const getServerRuntimeEnv = () => {
  if (!isServerSide()) {
    throw new Error('getServerRuntimeEnv is server-side only')
  }

  const { API_URL = 'http://localhost:4444' } = process.env

  return {
    // Will only be available on the server side
    // Requests made by the server are internal request made directly to the api hostname
    graphqlUrl: API_URL,
    graphqlEndpoint: graphqlPath,
  }
}
