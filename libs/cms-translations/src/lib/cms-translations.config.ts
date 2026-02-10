import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

const schema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  memCacheExpiryMilliseconds: z.number().int().positive(),
})

export type CmsTranslationConfigType = z.infer<typeof schema>

export const CmsTranslationConfig = defineConfig({
  name: 'CmsTranslationConfig',
  schema,
  load: (env) => ({
    redis: {
      nodes: env.requiredJSON('REDIS_NODES', [
        'localhost:7010',
        'localhost:7011',
        'localhost:7012',
        'localhost:7013',
        'localhost:7014',
        'localhost:7015',
      ]),
      ssl: !isRunningOnEnvironment('local'),
    },
    memCacheExpiryMilliseconds: 15 * 60 * 1000,
  }),
})
