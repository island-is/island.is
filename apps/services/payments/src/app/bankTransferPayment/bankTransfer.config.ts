import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  apiKey: z.string(),
  baseUrl: z.string(),
  /** TTL in seconds passed as `expireAt` to Blikk on create. Also gates our row's freshness. */
  paymentTtlSeconds: z.number().int().positive(),
  isConfigured: z.boolean(),
})

export type BankTransferModuleConfigType = z.infer<typeof schema>

export const BankTransferModuleConfig = defineConfig({
  name: 'BankTransferModuleConfig',
  schema,
  load: (env) => {
    const apiKey = env.required('BLIKK_API_KEY', '')
    const ttlRaw = env.required('BLIKK_PAYMENT_TTL_SECONDS', '300')
    const paymentTtlSeconds = Number.parseInt(ttlRaw, 10)

    return {
      apiKey,
      baseUrl: env.required('BLIKK_API_BASE_URL', 'https://stage.blikk.tech'),
      paymentTtlSeconds:
        Number.isFinite(paymentTtlSeconds) && paymentTtlSeconds > 0
          ? paymentTtlSeconds
          : 300,
      isConfigured: apiKey.length > 0,
    }
  },
})
