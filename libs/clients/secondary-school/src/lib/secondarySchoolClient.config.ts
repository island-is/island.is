import { defineConfig } from '@island.is/nest/config'
import { MMSScope } from '@island.is/auth/scopes'
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
        scope: [MMSScope.framhaldsskolaumsokn],
      }
    },
  },
)

export const SecondarySchoolPublicProgrammeClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'SecondarySchoolClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_SECONDARY_SCHOOL_PATH',
        'IS-DEV/GOV/10066/MMS-Protected/umsoknagatt',
      ),
      scope: [MMSScope.namsbrautagrunnur],
    }
  },
})
