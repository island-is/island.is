import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const BifrostUniversityApplicationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'BifrostUniversityApplicationClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_UNIVERSITY_GATEWAY_BIFROST_UNIVERSITY_PATH',
        'IS-DEV/EDU/10057/Bifrost-Protected/umsoknir-v1',
      ),
      scope: [],
      fetchTimeout:
        env.optionalJSON(
          'XROAD_UNIVERSITY_GATEWAY_BIFROST_UNIVERSITY_TIMEOUT',
        ) ?? 120000,
    }
  },
})
