import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const HmsLoansClientConfig = defineConfig({
  name: 'HmsLoansClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HMS_LOANS_PATH',
      'IS-DEV/GOV/10033/HMS-Protected/libra-v1',
    ),
  }),
})
