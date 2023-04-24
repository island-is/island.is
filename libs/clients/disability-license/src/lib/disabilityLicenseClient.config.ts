import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const DisabilityLicenseClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DisabilityLicenseClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_DISABILITY_LICENSE_PATH',
        'IS-DEV/GOV/10008/TR-Protected/oryrki-v1',
      ),
      fetch: {
        timeout: env.optionalJSON('DISABILITY_LICENSE_FETCH_TIMEOUT') ?? 10000,
        scope: ['@tr.is/oryrki:read'],
      },
    }
  },
})
