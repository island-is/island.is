import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { isProduction } from '../environment/environment'

const BffConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  identityServerClientId: z.string(),
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
      identityServerClientId: env.required('IDENTITY_SERVER_CLIENT_ID'),
    }
  },
})
