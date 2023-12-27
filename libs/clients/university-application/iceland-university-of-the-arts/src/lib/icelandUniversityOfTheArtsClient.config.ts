import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const IcelandUniversityOfTheArtsApplicationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IcelandUniversityOfTheArtsApplicationClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_UNIVERSITY_GATEWAY_ICELAND_UNIVERSITY_OF_THE_ARTS_PATH',
        'IS-DEV/EDU/10049/LHI-Protected/umsoknir-v1',
      ),
      scope: [],
      fetchTimeout:
        env.optionalJSON(
          'XROAD_UNIVERSITY_GATEWAY_ICELAND_UNIVERSITY_OF_THE_ARTS_TIMEOUT',
        ) ?? 120000,
    }
  },
})
