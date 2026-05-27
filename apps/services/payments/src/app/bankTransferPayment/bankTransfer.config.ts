import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  apiKey: z.string(),
  baseUrl: z.string(),
  isConfigured: z.boolean(),
})

export type BankTransferModuleConfigType = z.infer<typeof schema>

export const BankTransferModuleConfig = defineConfig({
  name: 'BankTransferModuleConfig',
  schema,
  load: (env) => {
    const apiKey = env.required('BLIKK_API_KEY', '')

    return {
      apiKey,
      baseUrl: env.required('BLIKK_API_BASE_URL', 'https://stage.blikk.tech'),
      isConfigured: apiKey.length > 0,
    }
  },
})
