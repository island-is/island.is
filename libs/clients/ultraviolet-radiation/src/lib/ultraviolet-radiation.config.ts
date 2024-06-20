import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  apiKey: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const UltravioletRadiationClientConfig = defineConfig({
  name: 'UltravioletRadiationClientConfig',
  schema,
  load(env) {
    return {
      apiKey: env.required('ULTRAVIOLET_RADIATION_API_KEY'),
      redis: {
        nodes: env.requiredJSON('APOLLO_CACHE_REDIS_NODES', []),
        ssl: env.optionalJSON('APOLLO_CACHE_REDIS_SSL', false) ?? true,
      },
    }
  },
})
