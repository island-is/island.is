import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
  requestActorToken: z.boolean(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const RskRentalDayRateClientConfig = defineConfig({
  name: 'RskRentalDayRateClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_RSK_PROCURING_PATH',
      'IS-DEV/GOV/10006/Skatturinn/rentaldayrate-v1',
    ),
    tokenExchangeScope: env.optionalJSON('XROAD_RSK_PROCURING_SCOPE') ?? [
      '@rsk.is/prokura',
    ],
    requestActorToken:
      env.optionalJSON('XROAD_RSK_PROCURING_ACTOR_TOKEN') ?? false,
    redis: {
      nodes: env.optionalJSON('XROAD_RSK_PROCURING_REDIS_NODES') ?? [],
      ssl: env.optionalJSON('XROAD_RSK_PROCURING_REDIS_SSL', false) ?? true,
    },
  }),
})
