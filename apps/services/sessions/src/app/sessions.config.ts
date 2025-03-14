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
        'localhost:7010',
        'localhost:7011',
        'localhost:7012',
        'localhost:7013',
        'localhost:7014',
        'localhost:7015',
      ]),
      ssl: env.requiredJSON('REDIS_USE_SSL', false),
    },
  }),
})
