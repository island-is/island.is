import { defineConfig } from '@island.is/nest/config'

import { z } from 'zod'
import { environment } from '../environment'
import { removeTrailingSlash } from '../utils/removeTrailingSlash'

export const idsSchema = z.strictObject({
  issuer: z.string(),
  clientId: z.string(),
  scopes: z.string().array(),
  secret: z.string(),
})

const BffConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  graphqlApiEndpont: z.string(),
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
  parSupportEnabled: z.boolean().optional(),
  /**
   * Allowed external API URLs that the BFF can proxy requests to
   */
  allowedExternalApiUrls: z.array(z.string()),
  allowedRedirectUris: z.string().array(),
  callbacksRedirectUris: z.strictObject({
    login: z.string(),
    logout: z.string(),
  }),
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
      /**
       * Our main GraphQL API endpoint
       */
      graphqlApiEndpont: env.required('BFF_PROXY_API_ENDPOINT'),
      redis: {
        nodes: env.requiredJSON('REDIS_URL_NODE_01', [
          'localhost:7000',
          'localhost:7001',
          'localhost:7002',
          'localhost:7003',
          'localhost:7004',
          'localhost:7005',
        ]),
        ssl: environment.production,
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
    }
  },
})
