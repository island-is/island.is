import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const UniversityOfIcelandClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'UniversityOfIcelandClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_UNIVERSITY_OF_ICELAND_PATH',
        'IS-DEV/EDU/10010/HI-Protected/brautskraning-v1',
      ),
      fetch: {
        timeout: 30000,
        scope: ['@hi.is/brautskraningar'],
      },
    }
  },
})
