import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

const schema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  paymentGateway: z.object({
    paymentsTokenSigningSecret: z.string(),
    paymentsTokenSigningAlgorithm: z.string(),
    paymentsApiSecret: z.string(),
    paymentsApiHeaderKey: z.string(),
    paymentsApiHeaderValue: z.string(),
    paymentsGatewayApiUrl: z.string(),
    systemCalling: z.string(),
  }),
  tokenExpiryMinutes: z.number().int(),
  memCacheExpiryMinutes: z.number().int(),
  webOrigin: z.string(),
})

export type CardPaymentModuleConfigType = z.infer<typeof schema>

export const CardPaymentModuleConfig = defineConfig({
  name: 'CardPaymentModuleConfig',
  schema,
  load: (env) => ({
    redis: {
      nodes: env.requiredJSON('REDIS_NODES', [
        'localhost:7010',
        'localhost:7011',
        'localhost:7012',
        'localhost:7013',
        'localhost:7014',
        'localhost:7015',
      ]),
      ssl: !isRunningOnEnvironment('local'),
    },
    paymentGateway: {
      paymentsTokenSigningSecret: env.required('PAYMENTS_TOKEN_SIGNING_SECRET'),
      paymentsTokenSigningAlgorithm: env.required(
        'PAYMENTS_TOKEN_SIGNING_ALGORITHM',
      ),
      paymentsApiSecret: env.required('PAYMENTS_GATEWAY_API_SECRET'),
      paymentsApiHeaderKey: env.required('PAYMENTS_GATEWAY_API_HEADER_KEY'),
      paymentsApiHeaderValue: env.required('PAYMENTS_GATEWAY_API_HEADER_VALUE'),
      paymentsGatewayApiUrl: env.required('PAYMENTS_GATEWAY_API_URL'),
      systemCalling: env.required('PAYMENTS_GATEWAY_SYSTEM_CALLING'),
    },
    tokenExpiryMinutes: env.optionalJSON('PAYMENTS_TOKEN_EXPIRY_MINUTES') ?? 2,
    memCacheExpiryMinutes:
      env.optionalJSON('PAYMENTS_MEM_CACHE_EXPIRY_MINUTES') ?? 2,
    webOrigin: env.required('PAYMENTS_WEB_URL', 'http://localhost:4200/greida'),
  }),
})
