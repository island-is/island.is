import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { z } from 'zod'

const PasskeysCoreModule = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const PasskeysCoreConfig = defineConfig({
  name: 'ApplicationFilesModule',
  schema: PasskeysCoreModule,
  load: (env) => ({
    redis: {
      nodes: env.requiredJSON('REDIS_URL_NODE_01', [
        'localhost:7000',
        'localhost:7001',
        'localhost:7002',
        'localhost:7003',
        'localhost:7004',
        'localhost:7005',
      ]),
      ssl: !isRunningOnEnvironment('local'),
    },
  }),
})
