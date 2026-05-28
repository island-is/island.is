import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

import { environment } from '../../environments'

const schema = z.object({
  apiKey: z.string(),
  baseUrl: z.string(),
  callbackBaseUrl: z.string(),
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
      // Where Blikk POSTs status-update webhooks. Mirrors invoice's `callbackBaseUrl` — the public
      // origin of THIS service, not the frontend (that's `PaymentFlowModuleConfig.webOrigin`).
      callbackBaseUrl: env.required(
        'BLIKK_CALLBACK_BASE_URL',
        `http://localhost:${environment.port}`,
      ),
      isConfigured: apiKey.length > 0,
    }
  },
})
