import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const PassportsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'PassportsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'IS-DEV/GOV/10001/SKRA-Protected/Forskraning-V1',
      ),
      fetch: {
        timeout: 10000,
        scope: ['@skra.is/individuals'],
      },
    }
  },
})
