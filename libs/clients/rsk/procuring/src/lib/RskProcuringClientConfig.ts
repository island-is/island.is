import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const RskProcuringClientConfig = defineConfig({
  name: 'RskProcuringClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_RSK_PROCURING_PATH',
      'IS-DEV/GOV/10006/Skatturinn/prokura-v1',
    ),
    tokenExchangeScope: env.optionalJSON('XROAD_RSK_PROCURING_SCOPE') ?? [
      '@rsk.is/prokura',
    ],
    redis: {
      nodes: env.optionalJSON('XROAD_RSK_PROCURING_REDIS_NODES') ?? [],
      ssl: env.optionalJSON('XROAD_RSK_PROCURING_REDIS_SSL', false) ?? true,
    },
  }),
})
