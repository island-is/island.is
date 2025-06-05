import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  scope: z.array(z.string()),
})

export const LegalGazetteClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'LegalGazetteClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_LEGAL_GAZETTE_PATH',
      'IS-DEV/GOV/10014/DMR-Protected/legal-gazette-api',
    ),
    scope: ['api_resource.scope'],
    fetch: {
      timeout: 10000,
    },
  }),
})
