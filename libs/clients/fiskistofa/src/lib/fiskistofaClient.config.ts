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
})

export const FiskistofaClientConfig = defineConfig({
  name: 'FiskistofaApi',
  schema,
  load(env) {
    return {
      url: env.required('FISKISTOFA_API_URL'),
      fetch: {
        timeout: env.optionalJSON('FISKISTOFA_API_TIMEOUT') ?? 10000,
      },
      // TODO: add to AWS env
      accessTokenServiceClientSecret: env.required(
        'FISKISTOFA_ACCESS_TOKEN_SERVICE_CLIENT_SECRET',
      ),
      accessTokenServiceUrl: env.required(
        'FISKISTOFA_ACCESS_TOKEN_SERVICE_URL',
      ),
      accessTokenServiceClientId: env.required(
        'FISKISTOFA_ACCESS_TOKEN_SERVICE_CLIENT_ID',
      ),
      accessTokenServiceAudience: env.required(
        'FISKISTOFA_ACCESS_TOKEN_SERVICE_AUDIENCE',
      ),
    }
  },
})
