import { HmsScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
})

export const HousingBenefitsConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HousingBenefitsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_HMS_HOUSING_BENEFITS_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/husbot-v1',
      ),
      fetchTimeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 15000,
      tokenExchangeScope: [HmsScope.housingBenefits],
    }
  },
})
