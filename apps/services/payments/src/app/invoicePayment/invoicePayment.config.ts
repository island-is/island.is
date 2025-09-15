import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'
import { environment } from '../../environments'

const schema = z.object({
  callbackBaseUrl: z.string(),
  tokenExpiryMinutes: z.number().int(),
  memCacheExpiryMinutes: z.number().int(),
  tokenSigningSecret: z.string(),
  tokenSigningAlgorithm: z.string(),
  previousTokenSigningSecret: z.string().optional(),
})

export type InvoicePaymentModuleConfigType = z.infer<typeof schema>

export const InvoicePaymentModuleConfig = defineConfig({
  name: 'InvoicePaymentModuleConfig',
  schema,
  load: (env) => ({
    callbackBaseUrl: env.required(
      'PAYMENTS_SERVICE_INTERNAL_CLUSTER_URL',
      `http://localhost:${environment.port}`,
    ),
    tokenExpiryMinutes: env.optionalJSON('INVOICE_TOKEN_EXPIRY_MINUTES') ?? 30, // TODO: do they expire?
    memCacheExpiryMinutes:
      env.optionalJSON('INVOICE_MEM_CACHE_EXPIRY_MINUTES') ?? 5,
    tokenSigningSecret: env.required('PAYMENTS_INVOICE_TOKEN_SIGNING_SECRET'),
    tokenSigningAlgorithm: env.required(
      'PAYMENTS_INVOICE_TOKEN_SIGNING_ALGORITHM',
      'HS256',
    ),
    previousTokenSigningSecret: env.optional(
      'PAYMENTS_INVOICE_PREVIOUS_TOKEN_SIGNING_SECRET',
    ),
  }),
})
