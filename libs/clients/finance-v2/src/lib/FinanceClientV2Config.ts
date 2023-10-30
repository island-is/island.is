import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const FinanceClientV2Config = defineConfig({
  name: 'FinanceClientV2Config',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FINANCES_V2_PATH',
      'IS-DEV/GOV/10021/FJS-Public/financeServicesFJS_v2',
    ),
    tokenExchangeScope: env.optionalJSON('XROAD_FINANCES_SCOPE') ?? [
      '@fjs.is/finance',
      // TODO: Remove when fjs has migrated to the scope above.
      'api_resource.scope',
    ],
    fetchTimeout: env.optionalJSON('XROAD_FINANCES_TIMEOUT') ?? 20000,
  }),
})
