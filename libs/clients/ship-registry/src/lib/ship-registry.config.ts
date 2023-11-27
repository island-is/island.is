import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const ShipRegistryClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'ShipRegistryClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_SHIP_REGISTRY_PATH',
      'IS-DEV/GOV/10017/Samgongustofa-Protected/skipaskra-V1',
    ),
  }),
})
