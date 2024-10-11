import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const HolarUniversityApplicationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HolarUniversityApplicationClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_UNIVERSITY_GATEWAY_HOLAR_UNIVERSITY_PATH',
        'IS-DEV/EDU/10055/Holar-Protected/umsoknir-v1',
      ),
      scope: [],
    }
  },
})
