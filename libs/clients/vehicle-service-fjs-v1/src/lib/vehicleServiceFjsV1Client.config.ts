import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const VehicleServiceFjsV1ClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'VehicleServiceFjsV1Client',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_VEHICLE_SERVICE_FJS_V1_PATH',
        'IS-DEV/GOV/10021/FJS-Public/VehicleServiceFJS_v1',
      ),
      scope: [
        '@fjs.is/finance',
        // TODO: Remove when fjs has migrated to the scope above.
        'api_resource.scope',
      ],
    }
  },
})
