import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  path: z.string(),
  scope: z.array(z.string()),
})

export const UniversityOfAkureyriClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'UniversityOfAkureyriClient',
  schema,
  load(env) {
    return {
      path: env.required(
        'XROAD_UNIVERSITY_OF_AKURERYI_PATH',
        'IS-DEV/EDU/10054/UNAK-Protected/brautskraning-v1',
      ),
      scope: [''],
    }
  },
})
