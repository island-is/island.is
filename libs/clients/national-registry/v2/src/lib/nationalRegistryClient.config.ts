import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
  requestActorToken: z.boolean(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const NationalRegistryClientConfig = defineConfig({
  name: 'NationalRegistryClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
        'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Einstaklingar-v1',
      ),
      fetchTimeout:
        env.optionalJSON('XROAD_NATIONAL_REGISTRY_TIMEOUT') ?? 10000,
      tokenExchangeScope: env.optionalJSON('XROAD_NATIONAL_REGISTRY_SCOPE') ?? [
        '@skra.is/individuals',
      ],
      requestActorToken:
        env.optionalJSON('XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN') ?? false,
      redis: {
        nodes: env.optionalJSON('XROAD_NATIONAL_REGISTRY_REDIS_NODES') ?? [],
        ssl:
          env.optionalJSON('XROAD_NATIONAL_REGISTRY_REDIS_SSL', false) ?? true,
      },
    }
  },
})
