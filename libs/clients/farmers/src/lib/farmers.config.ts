import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const FarmersClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FarmersClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FARMERS_PATH',
      'IS-DEV/GOV/10000/Farmers-Protected/FarmersApi-v1',
    ),
  }),
})
