import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const ExemptionForTransportationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'ExemptionForTransportationClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_EXEMPTION_FOR_TRANSPORTATION_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Leyfur-V1',
      ),
      scope: ['@samgongustofa.is/leyfur-test'],
    }
  },
})
