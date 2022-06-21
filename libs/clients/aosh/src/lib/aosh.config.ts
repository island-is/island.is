import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
    clientId: z.string(),
  }),
})

export const AoshClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'AoshClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_ADR_MACHINE_SERVICE_PATH',
      'IS-DEV/GOV/10013/Vinnueftirlitid-Protected',
    ),
    fetch: {
      timeout: 10000,
      scope: ['@ver.is/rettindaskra'],
      clientId: '@ver.is/clients/test-client',
    },
  }),
})
