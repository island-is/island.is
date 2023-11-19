import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  sourceDataPaths: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const StatisticsClientConfig = defineConfig({
  name: 'StatisticsClientConfig',
  schema,
  load(env) {
    return {
      sourceDataPaths: env.required('CHART_STATISTIC_SOURCE_DATA_PATHS'),
      redis: {
        nodes: env.requiredJSON('APOLLO_CACHE_REDIS_NODES', []),
        ssl: env.optionalJSON('APOLLO_CACHE_REDIS_SSL', false) ?? true,
      },
    }
  },
})
