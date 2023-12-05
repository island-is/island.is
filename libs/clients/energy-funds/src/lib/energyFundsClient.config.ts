import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
})

export const EnergyFundsClientConfig = defineConfig({
  name: 'EnergyFundsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_ENERGY_FUNDS_PATH',
        'IS-DEV/GOV/10021/FJS-Public/ElectricCarSubSidySerivce_v1',
      ),
      tokenExchangeScope: env.optionalJSON('XROAD_ENERGY_FUNDS_SCOPE') ?? [
        '@fjs.is/finance',
        // TODO: Remove when fjs has migrated to the scope above.
        'api_resource.scope',
      ],
    }
  },
})
