import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  verificationCallbackSigningSecret: z.string(),
})

export const PaymentsApiModuleConfig = defineConfig({
  name: 'PaymentsApiModuleConfig',
  schema,
  load: (env) => ({
    verificationCallbackSigningSecret: env.required(
      'PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET',
      '',
    ),
  }),
})
