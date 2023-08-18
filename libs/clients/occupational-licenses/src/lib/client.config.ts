import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const OccupationalLicensesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'OccupationalLicensesClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HEALTH_DIRECTORATE_PATH',
      'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
    ),
  }),
})
