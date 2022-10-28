import { NationalRegistryScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

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

export const HMSClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HMSClient',
  schema,
  load(env) {
    const clientSecret = env.optional('XROAD_HMS_CLIENT_SECRET')
    return {
      xRoadServicePath: env.required(
        'XROAD_HMS_SERVICE_PATH',
        'IS-TEST/GOV/5812191480/HMS-Protected/Fasteignir-v1',
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_HMS_TIMEOUT') ?? 10000,
        autoAuth: clientSecret
          ? {
              mode: 'tokenExchange',
              issuer: env.required(
                'IDENTITY_SERVER_ISSUER_URL',
                'https://identity-server.dev01.devland.is',
              ),
              clientId:
                env.optional('XROAD_PROPERTIES_CLIENT_ID') ??
                '@island.is/clients/national-registry',
              clientSecret,
              scope: env.optionalJSON('XROAD_PROPERTIES_SCOPE') ?? [
                NationalRegistryScope.properties,
                'api_resource.scope',
              ],
            }
          : undefined,
      },
    }
  },
})
