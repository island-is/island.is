import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
    autoAuth: z
      .object({
        mode: z.enum(['token', 'tokenExchange', 'auto']),
        issuer: z.string(),
        clientId: z.string(),
        clientSecret: z.string(),
        scope: z.array(z.string()),
      })
      .optional(),
  }),
})

export const AirDiscountSchemeClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'AirDiscountSchemeClient',
  schema,
  load(env) {
    const clientSecret = 'A4t5t7itPLvdyS2QuFMY3bZhB' //TODO: Get this normally
    return {
      fetch: {
        timeout: 10000,
        autoAuth: clientSecret
          ? {
              mode: 'tokenExchange',
              issuer: env.required(
                'IDENTITY_SERVER_ISSUER_URL',
                'https://identity-server.dev01.devland.is',
              ),
              clientId:
                //'@island.is/clients/air-discount-scheme',
                //'@vegagerdin.is/air-discount-scheme',
                '@island.is/web',
              clientSecret,
              scope: ['@vegagerdin.is/air-discount-scheme-scope'],
            }
          : undefined,
      },
    }
  },
})
