import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'
import { HmsScope } from '@island.is/auth/scopes'

const schema = z.object({
  xRoadServicePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const HmsLoansClientConfig = defineConfig({
  name: 'HmsLoansClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HMS_LOANS_PATH',
      'IS-DEV/GOV/10033/HMS-Protected/libra-v1',
    ),
    tokenExchangeScope: env.optionalJSON('XROAD_HMS_LOANS_SCOPE') ?? [
      HmsScope.loans,
    ],
    fetchTimeout: env.optionalJSON('XROAD_HMS_LOANS_TIMEOUT') ?? 20000,
  }),
})
