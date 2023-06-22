import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  bypassCacheSecret: z.string().optional(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const GraphQLConfig = defineConfig({
  name: 'GraphQL Config',
  schema,
  load: (env) => ({
    bypassCacheSecret: env.optional('APOLLO_BYPASS_CACHE_SECRET'),
    redis: {
      nodes: env.requiredJSON('APOLLO_CACHE_REDIS_NODES', []),
      ssl: env.optionalJSON('APOLLO_CACHE_REDIS_SSL', false) ?? true,
    },
  }),
})
