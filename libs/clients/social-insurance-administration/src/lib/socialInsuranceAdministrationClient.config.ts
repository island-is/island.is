import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const SocialInsuranceAdministrationClientConfig = defineConfig({
  name: 'SocialInsuranceAdministrationApi',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'TR_XROAD_PATH',
      'IS-DEV/GOV/10008/TR-Protected/external-v1/api/protected/v1',
    ),
    fetch: {
      timeout: env.optionalJSON('XROAD_TR_TIMEOUT') ?? 30000,
    },
  }),
})
