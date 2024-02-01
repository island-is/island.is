import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
  fetchTimeout: z.number().int(),
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
        'https://devproxy.ru.is/test/api/custom', //todo: change to xroad path
      ),
      scope: [],
      fetchTimeout:
        env.optionalJSON(
          'XROAD_UNIVERSITY_GATEWAY_REYKJAVIK_UNIVERSITY_TIMEOUT',
        ) ?? 120000,
    }
  },
})
