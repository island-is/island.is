import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const AircraftRegistryClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'AircraftRegistryClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_AIRCRAFT_REGISTRY_PATH',
      'IS-DEV/GOV/10017/Samgongustofa-Protected/Loftfaraskra-V1',
    ),
  }),
})
