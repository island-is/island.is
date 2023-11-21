import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string().optional(),
})

export const InnaClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'InnaClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: undefined /* env.required(
      'XROAD_INNA_PATH',
      'IS-DEV/GOV/',
    )*/,
  }),
})
