import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'
import { StjornarradidScope } from '@island.is/auth/scopes'

const schema = z.object({
  basePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
})

export const ConsultationPortalClientConfig = defineConfig({
  name: 'ConsultationPortalApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'https://samradapi.island.is',
        'https://samradapi-test.devland.is',
      ),
      tokenExchangeScope: env.optionalJSON('CONSULTATION_PORTAL_SCOPE') ?? [
        StjornarradidScope.samradsgatt,
      ],
    }
  },
})
