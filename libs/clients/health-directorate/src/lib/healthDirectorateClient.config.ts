import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    scope: z.array(z.string()),
    timeout: z.number().int(),
  }),
})

export const HealthDirectorateClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HealthDirectorateClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HEALTH_DIRECTORATE_PATH',
      'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
    ),
    fetch: {
      scope: ['@landlaeknir.is/starfsleyfi'],
      timeout: 60000,
    },
  }),
})
