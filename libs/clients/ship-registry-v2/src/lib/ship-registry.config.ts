import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const ShipRegistryClientV2Config = defineConfig<z.infer<typeof schema>>({
  name: 'ShipRegistryClientV2Config',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_SHIP_REGISTRY_V2_PATH',
      'IS-DEV/GOV/10017/Samgongustofa-Protected/Skutan-Gov-V1',
    ),
  }),
})
