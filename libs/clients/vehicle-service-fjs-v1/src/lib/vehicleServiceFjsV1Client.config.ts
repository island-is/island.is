import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
  requestActorToken: z.boolean(),
})

export const VehicleServiceFjsV1ClientConfig = defineConfig({
  name: 'VehicleServiceFjsV1Client',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_VEHICLE_SERVICE_FJS_V1_PATH',
        'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
      ),
      fetchTimeout:
        env.optionalJSON('XROAD_VEHICLE_SERVICE_FJS_V1_TIMEOUT') ?? 20000,
      tokenExchangeScope: env.optionalJSON(
        'XROAD_VEHICLE_SERVICE_FJS_V1_SCOPE',
      ) ?? [
        '@fjs.is/finance',
        // TODO: Remove when fjs has migrated to the scope above.
        'api_resource.scope',
      ],
      requestActorToken:
        env.optionalJSON('XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN') ?? false,
    }
  },
})
