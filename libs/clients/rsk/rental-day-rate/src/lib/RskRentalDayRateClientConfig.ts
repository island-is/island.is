import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const RskRentalDayRateClientConfig = defineConfig({
  name: 'RskRentalDayRateClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_RSK_RENTAL_RATE_PATH',
      'IS-DEV/GOV/10006/Skatturinn/rentaldayrate-v1',
    ),
  }),
})
