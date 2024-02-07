import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const FinanceClientV2Config = defineConfig({
  name: 'FinanceClientV2Config',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FINANCES_V2_PATH',
      'IS-DEV/GOV/10021/FJS-Public/financeServicesFJS_v2',
    ),
  }),
})
