import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  paymentGateway: z.object({
    paymentsTokenSigningSecret: z.string(),
    paymentsTokenSigningAlgorithm: z.string(),
    paymentsTokenSignaturePrefix: z.string(),
    paymentsApiSecret: z.string(),
    paymentsApiHeaderKey: z.string(),
    paymentsApiHeaderValue: z.string(),
    paymentsGatewayApiUrl: z.string(),
  }),
  tokenExpiryMinutes: z.number().int(),
  memCacheExpiryMinutes: z.number().int(),
})

export const CardPaymentModuleConfig = defineConfig({
  name: 'CardPaymentModuleConfig',
  schema,
  load: (env) => ({
    paymentGateway: {
      paymentsTokenSigningSecret: env.required('PAYMENTS_TOKEN_SIGNING_SECRET'),
      paymentsTokenSigningAlgorithm: env.required(
        'PAYMENTS_TOKEN_SIGNING_ALGORITHM',
      ),
      paymentsTokenSignaturePrefix: env.required(
        'PAYMENTS_TOKEN_SIGNATURE_PREFIX',
      ),
      paymentsApiSecret: env.required('PAYMENTS_API_SECRET'),
      paymentsApiHeaderKey: env.required('PAYMENTS_API_HEADER_KEY'),
      paymentsApiHeaderValue: env.required('PAYMENTS_API_HEADER_VALUE'),
      paymentsGatewayApiUrl: env.required('PAYMENTS_GATEWAY_API_URL'),
    },
    tokenExpiryMinutes: env.optionalJSON('PAYMENTS_TOKEN_EXPIRY_MINUTES') ?? 2,
    memCacheExpiryMinutes:
      env.optionalJSON('PAYMENTS_MEM_CACHE_EXPIRY_MINUTES') ?? 5,
  }),
})
