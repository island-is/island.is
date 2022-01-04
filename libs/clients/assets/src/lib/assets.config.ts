import { NationalRegistryScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  auth: z.object({
    issuer: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    scope: z.array(z.string()),
  }),
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const AssetsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'AssetsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_PROPERTIES_SERVICE_PATH',
        'IS-DEV/GOV/10001/SKRA-Protected/Fasteignir-v1',
      ),
      auth: {
        issuer: env.required(
          'IDENTITY_SERVER_ISSUER_URL',
          'https://identity-server.dev01.devland.is',
        ),
        clientId:
          env.optional('XROAD_PROPERTIES_CLIENT_ID') ??
          '@island.is/clients/national-registry',
        clientSecret: env.required('XROAD_PROPERTIES_CLIENT_SECRET'),
        scope: env.optionalJSON('XROAD_PROPERTIES_SCOPE') ?? [
          NationalRegistryScope.properties,
          'api_resource.scope',
        ],
      },
      fetch: {
        timeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 10000,
      },
    }
  },
})
