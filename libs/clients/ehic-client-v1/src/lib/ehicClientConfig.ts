import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { SjukraScope } from '@island.is/auth/scopes'

const schema = z.object({
  scope: z.array(z.string()),
  xRoadServicePath: z.string(),
})

export const EhicClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'clients-ehic-client-v1',
  schema,
  load(env) {
    return {
      scope: [SjukraScope.europeanHealthInsuranceCard],
      xRoadServicePath: env.required(
        'EHIC_XROAD_PROVIDER_ID',
        'IS-DEV/GOV/10007/SJUKRA-Protected/ehic',
      ),
    }
  },
})
