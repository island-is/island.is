import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  apiKey: z.string(),
  basePath: z.string(),
  /** Per-request timeout in ms, enforced by the enhanced fetch. */
  fetchTimeout: z.number().int().positive(),
})

export const BlikkClientConfig = defineConfig({
  name: 'BlikkClient',
  schema,
  load: (env) => ({
    apiKey: env.required('BLIKK_API_KEY', ''),
    basePath: env.required('BLIKK_API_BASE_URL', 'https://stage.blikk.tech'),
    fetchTimeout: env.optionalJSON('BLIKK_FETCH_TIMEOUT') ?? 10000,
  }),
})
