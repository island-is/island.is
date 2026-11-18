import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  issuer: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.string(),
  requiredAcr: z.string(),
  allowFakeLogin: z.boolean(),
  requiredForClients: z.array(z.string()),
  maxAgeInSeconds: z.number(),
})

export const MedicineDelegationStepUpConfig = defineConfig({
  name: 'MedicineDelegationStepUpConfig',
  schema,
  load: (env) => ({
    issuer:
      env.optional('STEP_UP_CIBA_ISSUER_URL') ??
      env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ),
    clientId:
      env.optional('STEP_UP_CIBA_CLIENT_ID') ?? '@island.is/clients/step-up',
    clientSecret: env.optional('STEP_UP_CIBA_CLIENT_SECRET') ?? '',
    scope:
      env.optional('STEP_UP_CIBA_SCOPE') ?? 'openid @island.is/auth/step-up',
    requiredAcr: env.optional('STEP_UP_REQUIRED_ACR') ?? 'eidas-loa-high',
    // Only set for dev in infra: fake logins (gervimenn) can't reach the required acr.
    allowFakeLogin:
      (env.optionalJSON('STEP_UP_ALLOW_FAKE_LOGIN') ?? false) === true,
    // The native app grants with the same mutation and has no step-up screen yet.
    requiredForClients: env.optionalJSON(
      'MEDICINE_DELEGATION_STEP_UP_CLIENTS',
    ) ?? ['@island.is/web'],
    maxAgeInSeconds:
      env.optionalJSON('MEDICINE_DELEGATION_STEP_UP_MAX_AGE_IN_SECONDS') ?? 600,
  }),
})
