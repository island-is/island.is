import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
  xRoadServicePath: z.string(),
})

export const RightsPortalClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RightsPortalConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
      'IS-DEV/GOV/10007/SJUKRA-Protected/minarsidur',
    ),
    fetch: {
      timeout: 30000,
      scope: ['@sjukra.is/minarsidur'],
    },
  }),
})
