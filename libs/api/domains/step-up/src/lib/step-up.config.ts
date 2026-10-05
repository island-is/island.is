import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  // The API's own CIBA client, used for nothing but unlocking screens. Kept
  // apart from delegation-api's: a client is the party that acts on the result.
  issuer: z.string(),
  clientId: z.string(),
  clientSecret: z.string().optional(),
  // Must include openid (CIBA requires it) and a scope that puts nationalId on
  // the access token.
  scope: z.string(),
  requiredAcr: z.string(),
  // Local fake login cannot assert a real assurance level, so on a developer
  // machine the happy path is otherwise unreachable. Ignored outside
  // development — see load().
  allowAnyAcrInDev: z.boolean(),
  // Clients whose sessions locked screens apply to. Only the app for now: its
  // token lives for up to a year, so presence has to be proven again.
  clients: z.array(z.string()),
  // Locks again after this long without using a locked screen.
  idleSeconds: z.number().min(60),
  // Locks again this long after unlocking, however busy.
  maxSeconds: z.number().min(60),
  // How many unlocks a person may start per window, so a lost phone can't
  // flood the owner with requests.
  maxStarts: z.number().min(1),
  maxStartsWindowSeconds: z.number().min(60),
  // What the person sees on their phone.
  bindingMessage: z.string().max(120),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const StepUpConfig = defineConfig<z.infer<typeof schema>>({
  name: 'StepUpConfig',
  schema,
  load(env) {
    return {
      issuer:
        env.optional('STEP_UP_CIBA_ISSUER_URL') ??
        env.required(
          'IDENTITY_SERVER_ISSUER_URL',
          'https://identity-server.dev01.devland.is',
        ),
      clientId:
        env.optional('STEP_UP_CIBA_CLIENT_ID') ?? '@island.is/clients/step-up',
      clientSecret: env.optional('STEP_UP_CIBA_CLIENT_SECRET'),
      scope:
        env.optional('STEP_UP_CIBA_SCOPE') ?? 'openid @island.is/auth/step-up',
      requiredAcr: env.optional('STEP_UP_REQUIRED_ACR') ?? 'eidas-loa-high',
      // Gated on NODE_ENV rather than on the variable alone, so setting it in a
      // deployed environment does nothing.
      allowAnyAcrInDev:
        process.env['NODE_ENV'] === 'development' &&
        (env.optionalJSON('STEP_UP_ALLOW_ANY_ACR_IN_DEV') ?? false) === true,
      clients: env.optionalJSON<string[]>('STEP_UP_CLIENTS') ?? [
        '@island.is/app',
      ],
      idleSeconds: env.optionalJSON<number>('STEP_UP_IDLE_SECONDS') ?? 15 * 60,
      maxSeconds:
        env.optionalJSON<number>('STEP_UP_MAX_SECONDS') ?? 12 * 60 * 60,
      maxStarts: env.optionalJSON<number>('STEP_UP_MAX_STARTS') ?? 5,
      maxStartsWindowSeconds:
        env.optionalJSON<number>('STEP_UP_MAX_STARTS_WINDOW_SECONDS') ??
        15 * 60,
      bindingMessage:
        env.optional('STEP_UP_BINDING_MESSAGE') ??
        'Opna viðkvæmar upplýsingar í Ísland.is appinu',
      redis: {
        nodes: env.optionalJSON('STEP_UP_REDIS_NODES') ?? [],
        ssl: env.optionalJSON('STEP_UP_REDIS_SSL', false) ?? true,
      },
    }
  },
})
