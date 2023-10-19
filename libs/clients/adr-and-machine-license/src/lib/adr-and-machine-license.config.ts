import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const AdrAndMachineLicenseClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'AdrAndMachineLicenseClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_ADR_MACHINE_LICENSE_PATH',
      'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/rettindi-skirteini-opin',
    ),
    fetch: {
      timeout: env.optionalJSON('ADR_LICENSE_FETCH_TIMEOUT') ?? 10000,
      scope: ['@ver.is/rettindaskra'],
    },
  }),
})
