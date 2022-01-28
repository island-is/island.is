import { defineConfig } from '@island.is/nest/config'

export const RskProcuringClientConfig = defineConfig({
  name: 'RskProcuringClientConfig',
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_RSK_PROCURING_PATH',
      'IS-DEV/GOV/10006/Skatturinn/prokura-v1',
    ),
    redis: {
      nodes: env.optionalJSON('XROAD_RSK_PROCURING_REDIS_NODES') ?? [],
      ssl: env.optionalJSON('XROAD_RSK_PROCURING_REDIS_SSL', false) ?? true,
    },
  }),
})
