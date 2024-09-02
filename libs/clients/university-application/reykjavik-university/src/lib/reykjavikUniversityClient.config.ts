import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const ReykjavikUniversityApplicationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'ReykjavikUniversityApplicationApi',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_UNIVERSITY_GATEWAY_REYKJAVIK_UNIVERSITY_PATH',
        'IS-DEV/EDU/10062/RvkUni-Hvin-Protected/umsoknir-v1',
      ),
      scope: [],
    }
  },
})
