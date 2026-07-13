import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  baseUrl: z.string(),
})

export const ReiknivelarClientConfig = defineConfig({
  name: 'ReiknivelarClientConfig',
  schema,
  load: (env) => ({
    baseUrl: env.required(
      'REIKNIVELAR_BASE_URL',
      'https://reiknivelarapi.rsk.is',
    ),
  }),
})
