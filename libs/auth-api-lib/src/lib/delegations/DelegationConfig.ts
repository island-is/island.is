import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  userInfoUrl: z.string(),
  defaultValidityPeriodInDays: z.number().min(1),
})

export const DelegationConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DelegationConfig',
  schema,
  load: (env) => ({
    userInfoUrl:
      env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ) + '/connect/userinfo',
    defaultValidityPeriodInDays:
      env.optionalJSON('DELEGATION_DEFAULT_VALID_PERIOD_IN_DAYS') ?? 365,
  }),
})
