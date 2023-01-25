import { z } from 'zod';

import { defineConfig } from '@island.is/nest/config';

export const bullModuleName = 'activities_api_bull_module'
export const activitiesQueueName = 'activities'
export const sessionJobName = 'session'

const ActivitiesConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const ActivitiesConfig = defineConfig({
  name: 'ActivitiesConfig',
  schema: ActivitiesConfigSchema,
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
