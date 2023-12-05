import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const UniversityOfIcelandApplicationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'UniversityOfIcelandApplicationClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_UNIVERSITY_GATEWAY_UNIVERSITY_OF_ICELAND_PATH',
        'IS-DEV/EDU/10010/HI-Protected/umsoknir-v1',
      ),
      scope: [],
      fetchTimeout:
        env.optionalJSON(
          'XROAD_UNIVERSITY_GATEWAY_UNIVERSITY_OF_ICELAND_TIMEOUT',
        ) ?? 120000,
    }
  },
})
