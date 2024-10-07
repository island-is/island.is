import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const HealthDirectorateVaccinationsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HealthDirectorateVaccinationsClientConfig',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_HEALTH_DIRECTORATE_VACCINATION_PATH',
        'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/vaccination-v1',
      ),
      scope: ['@landlaeknir.is/vaccinations'],
    }
  },
})
