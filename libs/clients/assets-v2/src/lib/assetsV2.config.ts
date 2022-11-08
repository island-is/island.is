import { NationalRegistryScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

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

export const AssetsV2ClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'AssetsClient',
  schema,
  load(env) {
    const clientSecret = env.optional('XROAD_PROPERTIES_CLIENT_SECRET')
    return {
      xRoadServicePath: env.required(
        'XROAD_PROPERTIES_SERVICE_V2_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/Fasteignir-v1',
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 15000,
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
