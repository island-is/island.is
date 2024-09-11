import { defineConfig } from '@island.is/nest/config'
import { authSchema } from '../environment/environment.schema'

import { z } from 'zod'
import { isProduction, environment } from '../environment'

const BffConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  graphqlApiEndpont: z.string(),
  auth: authSchema,
  tokenSecretBase64: z.string(),
  // Determines if the BFF should support the PAR (Pushed Authorization Requests) flow or normal login flow
  parSupportEnabled: z.boolean().optional(),
  allowedExternalApiUrls: z.array(z.string()),
})

export const BffConfig = defineConfig({
  name: 'BffConfig',
  schema: BffConfigSchema,
  load(env) {
    return {
      parSupportEnabled:
        env.optional('BFF_PAR_SUPPORT_ENABLED') === 'true' || false,
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
        ssl: isProduction,
      },
      auth: environment.auth,
      tokenSecretBase64: env.required('BFF_TOKEN_SECRET_BASE64'),
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
