import { defineConfig } from '@island.is/nest/config'
import { authSchema } from '../environment/environment.schema'

import { z } from 'zod'
import { isProduction, environment } from '../environment'

const BffConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  auth: authSchema,
})

export const BffConfig = defineConfig({
  name: 'BffConfig',
  schema: BffConfigSchema,
  load(env) {
    return {
      redis: {
        nodes: env.requiredJSON('BFF_REDIS_NODES', [
          'localhost:7000',
          'localhost:7001',
          'localhost:7002',
          'localhost:7003',
          'localhost:7004',
          'localhost:7005',
        ]),
        ssl: isProduction,
      },
      auth: environment.auth,
    }
  },
})
