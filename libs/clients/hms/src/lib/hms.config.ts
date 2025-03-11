import { HmsScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
})

export const HmsConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HmsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_HMS_HOUSING_BENEFITS_PATH',
        'ISGOV/5501692829/island-is-client/fasteignir-v2-beta',
      ),
      fetchTimeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 15000,
      tokenExchangeScope: [HmsScope.housingBenefits],
    }
  },
})
