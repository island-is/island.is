import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  /** TTL in seconds passed as `expireAt` to Blikk on create. Also gates our row's freshness. */
  paymentTtlSeconds: z.number().int().positive(),
})

export type BankTransferModuleConfigType = z.infer<typeof schema>

export const BankTransferModuleConfig = defineConfig({
  name: 'BankTransferModuleConfig',
  schema,
  load: (env) => {
    const ttlRaw = env.required('BLIKK_PAYMENT_TTL_SECONDS', '300')
    const paymentTtlSeconds = Number.parseInt(ttlRaw, 10)

    return {
      paymentTtlSeconds:
        Number.isFinite(paymentTtlSeconds) && paymentTtlSeconds > 0
          ? paymentTtlSeconds
          : 300,
    }
  },
})
