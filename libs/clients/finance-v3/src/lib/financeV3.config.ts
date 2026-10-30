import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
})

export const FinanceClientV3Config = defineConfig<z.infer<typeof schema>>({
  name: 'FinanceClientV3Config',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FINANCES_V3_PATH',
      'IS-DEV/GOV/10021/FJS-Public/financeServicesFJS_v3',
    ),
    fetchTimeout: env.optionalJSON('XROAD_FINANCES_V3_TIMEOUT') ?? 20000,
  }),
})
