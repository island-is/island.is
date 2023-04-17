import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const ResidencePermitClientConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'ResidencePermitClient',
    schema,
    load(env) {
      return {
        xroadPath: env.required(
          'XROAD_RESIDENCE_PERMIT_PATH',
          'IS-DEV/GOV/10017/Utlendingastofnun-Protected/Residence-Permit-V1',
        ),
        scope: ['@utlendingastofnun/dvalarleyfi'],
      }
    },
  },
)
