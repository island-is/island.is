import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const AgriculturalUniversityOfIcelandApplicationClientConfig =
  defineConfig<z.infer<typeof schema>>({
    name: 'AgriculturalUniversityOfIcelandApplicationClient',
    schema,
    load(env) {
      return {
        xroadPath: env.required(
          'XROAD_UNIVERSITY_GATEWAY_AGRICULTURAL_UNIVERSITY_OF_ICELAND_PATH',
          'IS-DEV/EDU/10056/LBHI-Protected/umsoknir-v1',
        ),
        scope: [],
        fetchTimeout:
          env.optionalJSON(
            'XROAD_UNIVERSITY_GATEWAY_AGRICULTURAL_UNIVERSITY_OF_ICELAND_TIMEOUT',
          ) ?? 120000,
      }
    },
  })
