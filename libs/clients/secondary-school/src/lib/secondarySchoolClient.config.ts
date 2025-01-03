import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const SecondarySchoolClientConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'SecondarySchoolClient',
    schema,
    load(env) {
      return {
        xroadPath: env.required(
          'XROAD_SECONDARY_SCHOOL_PATH',
          'IS-DEV/GOV/10066/MMS-Protected/umsoknagatt',
        ),
        scope: [],
      }
    },
  },
)
