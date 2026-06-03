import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const DirectorateOfEqualityClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DirectorateOfEqualityClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_DIRECTORATE_OF_EQUALITY_PATH',
      'IS-DEV/GOV/10014/DMR-Protected/api.ritstjorn-jafnretti',
    ),
  }),
})
