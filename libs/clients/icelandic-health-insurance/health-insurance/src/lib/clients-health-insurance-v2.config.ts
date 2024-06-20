import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
})
export const HealthInsuranceV2ClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HealthInsuranceClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_HEALTH_INSURANCE_ID',
        'IS-DEV/GOV/10007/SJUKRA-Protected',
      ),
      username: env.required('XROAD_HEALTH_INSURANCE_V2_XROAD_USERNAME', ''),
      password: env.required('XROAD_HEALTH_INSURANCE_V2_XROAD_PASSWORD', ''),
    }
  },
})
