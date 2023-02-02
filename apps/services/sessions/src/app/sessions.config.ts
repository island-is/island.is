import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

export const bullModuleName = 'sessions_api_bull_module'
export const sessionsQueueName = 'sessions'
export const sessionJobName = 'session'

const SessionsConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const SessionsConfig = defineConfig({
  name: 'SessionsConfig',
  schema: SessionsConfigSchema,
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
      ssl: env.requiredJSON('REDIS_USE_SSL', false),
    },
  }),
})
