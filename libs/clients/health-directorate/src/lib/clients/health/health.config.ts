import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const HealthDirectorateHealthClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HealthDirectorateHealthClientConfig',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_HEALTH_DIRECTORATE_HEALTH_PATH',
        'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/health-service-v1',
      ),
      scope: ['@landlaeknir.is/health'],
    }
  },
})
