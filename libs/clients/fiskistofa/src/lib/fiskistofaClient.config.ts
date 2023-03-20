import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  url: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  accessTokenServiceUrl: z.string(),
  accessTokenServiceClientSecret: z.string(),
  accessTokenServiceClientId: z.string(),
  accessTokenServiceAudience: z.string(),
  scope: z.array(z.string()),
})

export const FiskistofaClientConfig = defineConfig({
  name: 'FiskistofaApi',
  schema,
  load(env) {
    return {
      scope: env.optionalJSON('FISKISTOFA_API_ACCESS_TOKEN_SERVICE_SCOPE') ?? [
        'read:skip',
        'read:stodtoflur',
        'read:stadaSkips',
      ],
      url: env.required('FISKISTOFA_API_URL'),
      fetch: {
        timeout: env.optionalJSON('FISKISTOFA_API_TIMEOUT') ?? 20000,
      },
      accessTokenServiceClientSecret: env.required(
        'FISKISTOFA_API_ACCESS_TOKEN_SERVICE_CLIENT_SECRET',
      ),
      accessTokenServiceUrl: env.required(
        'FISKISTOFA_API_ACCESS_TOKEN_SERVICE_URL',
      ),
      accessTokenServiceClientId: env.required(
        'FISKISTOFA_API_ACCESS_TOKEN_SERVICE_CLIENT_ID',
      ),
      accessTokenServiceAudience: env.required(
        'FISKISTOFA_API_ACCESS_TOKEN_SERVICE_AUDIENCE',
      ),
    }
  },
})
