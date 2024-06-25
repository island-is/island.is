import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const SocialInsuranceAdministrationClientConfig = defineConfig({
  name: 'SocialInsuranceAdministrationApi',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_TR_PATH',
      'IS-DEV/GOV/10008/TR-Protected/external-v1',
    ),
  }),
})
