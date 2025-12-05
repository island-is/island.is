import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const SocialInsuranceAdministrationClientConfigV2 = defineConfig({
  name: 'SocialInsuranceAdministrationApiV2',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_TR_PATH_V2',
      'IS-DEV/GOV/10008/TR-Protected/external-v2',
    ),
  }),
})
