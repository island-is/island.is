import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const AssetsClientConfig = defineConfig({
  name: 'AssetsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_PROPERTIES_SERVICE_PATH',
        'IS-DEV/GOV/10001/SKRA-Protected/Fasteignir-v1',
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 10000,
      },
    }
  },
})
