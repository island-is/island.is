import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string().optional(),
  scope: z.array(z.string()),
})

export const InnaClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'InnaClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_INNA_PATH',
      'IS-DEV/GOV/10066/MMS-Protected/inna-v1',
    ),
    scope: ['api_resource.scope'],
  }),
})
