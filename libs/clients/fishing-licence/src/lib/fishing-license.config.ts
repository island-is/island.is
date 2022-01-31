import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { FishingLicenseScope } from '@island.is/auth/scopes'

const schema = z.object({
  xRoadServicePath: z.string(),
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

export const FishingLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FishingLicenseClient',
  schema,
  load(env) {
    const clientSecret = env.optional('XROAD_FISHING_LICENSE_CLIENT_SECRET')
    return {
      xRoadServicePath: env.required(
        'XROAD_FISHING_LICENSE_SERVICE_PATH',
        'UNKNOWN_AT_THIS_TIME', //TODO
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_FISHING_LICENSE_TIMEOUT') ?? 10000,
        autoAuth: clientSecret
          ? {
              mode: 'tokenExchange',
              issuer: env.required(
                'IDENTITY_SERVER_ISSUER_URL',
                'https://identity-server.dev01.devland.is',
              ),
              clientId:
                env.optional('XROAD_FISHING_LICENSE_CLIENT_ID') ??
                '@island.is/clients/fishing-license',
              clientSecret,
              scope: env.optionalJSON('XROAD_FISHING_LICENSE_SCOPE') ?? [
                'api_resource.scope',
                FishingLicenseScope.main
              ],
            }
          : undefined,
      },
    }
  },
})
