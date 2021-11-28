import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int().optional(),
  }),
  redis: z.object({
    nodes: z.array(z.string()).optional(),
    ssl: z.boolean(),
  }),
})

export const NationalRegistryClientConfig = defineConfig({
  name: 'NationalRegistryClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
        'IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1',
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_NATIONAL_REGISTRY_TIMEOUT'),
      },
      redis: {
        nodes: env.optionalJSON('XROAD_NATIONAL_REGISTRY_REDIS_NODES'),
        ssl:
          env.optionalJSON('XROAD_NATIONAL_REGISTRY_REDIS_SSL', false) ?? true,
      },
    }
  },
})
