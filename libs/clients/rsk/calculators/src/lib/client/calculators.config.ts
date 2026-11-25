import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  baseUrl: z.string(),
})

export const CalculatorsClientConfig = defineConfig({
  name: 'CalculatorsClientConfig',
  schema,
  load: (env) => ({
    baseUrl: env.required(
      'RSK_CALCULATORS_BASE_URL',
      'https://reiknivelarapi.rsk.is',
    ),
  }),
})
