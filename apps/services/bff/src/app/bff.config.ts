import { defineConfig } from '@island.is/nest/config'

import { z } from 'zod'
import { removeTrailingSlash } from './utils/remove-trailing-slash'

export const idsSchema = z.strictObject({
  issuer: z.string(),
  clientId: z.string(),
  scopes: z.string().array(),
  secret: z.string(),
})

const BffConfigSchema = z.object({
  redis: z.object({
    name: z.string(),
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  graphqlApiEndpoint: z.string(),
  /**
   * The URL to redirect to after logging out
   */
  logoutRedirectUri: z.string(),
  /**
   * Bff client base URL
   */
  clientBaseUrl: z.string(),
  ids: idsSchema,
  /**
   * The base64 encoded secret used for encrypting and decrypting tokens.
   */
  tokenSecretBase64: z.string(),
  /**
   * Determines if the BFF should support the PAR (Pushed Authorization Requests) flow or normal login flow
   */
  parSupportEnabled: z.boolean(),
  /**
   * Allowed external API URLs that the BFF can proxy requests to
   */
  allowedExternalApiUrls: z.array(z.string()),
  allowedRedirectUris: z.string().array(),
  callbacksRedirectUris: z.strictObject({
    login: z.string(),
    logout: z.string(),
  }),
  /**
   * Time-to-live (TTL) for caching the user profile, in milliseconds.
   * This value determines how long the user profile will be cached before it is considered stale.
   *
   * Note: The TTL should be aligned with the lifespan of the Ids client refresh token.
   *       We also subtract 5 seconds from the TTL to handle latency and clock drift.
   */
  cacheUserProfileTTLms: z.number(),
  /**
   * Time-to-live (TTL) for caching the login attempts, in milliseconds.
   */
  cacheLoginAttemptTTLms: z.number(),
})

export const BffConfig = defineConfig({
  name: 'BffConfig',
  schema: BffConfigSchema,
  load(env) {
    const callbacksBaseRedirectPath = removeTrailingSlash(
      env.required('BFF_CALLBACKS_BASE_PATH'),
    )

    return {
      parSupportEnabled: env.optionalJSON('BFF_PAR_SUPPORT_ENABLED') ?? false,
      clientBaseUrl: env.required('BFF_CLIENT_BASE_URL'),
      logoutRedirectUri: env.required('BFF_LOGOUT_REDIRECT_URI'),
      /**
       * Our main GraphQL API endpoint
       */
      graphqlApiEndpoint: env.required('BFF_PROXY_API_ENDPOINT'),
      redis: {
        name: env.required('BFF_REDIS_NAME', 'unnamed-bff'),
        // Redis nodes are only required in production
        // In development, we can use a local Redis server or
        // rely on the default in-memory cache provided by CacheModule
        nodes: env.requiredJSON('REDIS_URL_NODE_01', []),
        ssl: env.optionalJSON('BFF_REDIS_SSL', false) ?? true,
      },
      ids: {
        issuer: env.required('IDENTITY_SERVER_ISSUER_URL'),
        clientId: env.required('IDENTITY_SERVER_CLIENT_ID'),
        secret: env.required('IDENTITY_SERVER_CLIENT_SECRET'),
        scopes: env.requiredJSON('IDENTITY_SERVER_CLIENT_SCOPES'),
      },
      allowedRedirectUris: env.requiredJSON('BFF_ALLOWED_REDIRECT_URIS'),
      callbacksRedirectUris: {
        login: `${callbacksBaseRedirectPath}/login`,
        logout: `${callbacksBaseRedirectPath}/logout`,
      },
      /**
       * The base64 encoded secret used for encrypting and decrypting.
       */
      tokenSecretBase64: env.required('BFF_TOKEN_SECRET_BASE64'),
      /**
       * Allowed external API URLs that the BFF can proxy requests to
       */
      allowedExternalApiUrls: env.requiredJSON(
        'BFF_ALLOWED_EXTERNAL_API_URLS',
        [
          // Download service local endpoint
          'http://localhost:3377/download/v1/*',
        ],
      ),
      /**
       * Time-to-live (TTL) in milliseconds for caching.
       */
      cacheUserProfileTTLms: env.requiredJSON('BFF_CACHE_USER_PROFILE_TTL_MS'),
      cacheLoginAttemptTTLms: env.requiredJSON('BFF_LOGIN_ATTEMPT_TTL_MS'),
    }
  },
})
