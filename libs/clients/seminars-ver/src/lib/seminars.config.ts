import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const SeminarsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'SeminarsVerClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_SEMINARS_VER_PATH',
      'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/namskeid',
    ),
  }),
})
