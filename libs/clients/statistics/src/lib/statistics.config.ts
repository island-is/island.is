import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const DEFAULT_CACHE_TTL = 15 * 60 * 1000 // 15 minutes

const schema = z.object({
  sourceDataPaths: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
    cacheTtl: z.number(),
  }),
})

export const StatisticsClientConfig = defineConfig({
  name: 'StatisticsClientConfig',
  schema,
  load(env) {
    const cacheTtlEnv = env.optional('CHART_STATISTIC_CACHE_TTL')

    const cacheTtl = cacheTtlEnv ? Number(cacheTtlEnv) : DEFAULT_CACHE_TTL

    return {
      sourceDataPaths: env.required('CHART_STATISTIC_SOURCE_DATA_PATHS', ''),
      redis: {
        nodes: env.requiredJSON('APOLLO_CACHE_REDIS_NODES', []),
        ssl: env.optionalJSON('APOLLO_CACHE_REDIS_SSL', false) ?? true,
        cacheTtl,
      },
    }
  },
})
