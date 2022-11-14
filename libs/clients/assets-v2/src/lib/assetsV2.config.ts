import { NationalRegistryScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
})

export const AssetsV2ClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'AssetsV2Client',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_PROPERTIES_SERVICE_V2_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/Fasteignir-v1',
      ),
      fetchTimeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 20000,
      tokenExchangeScope: env.optionalJSON('XROAD_PROPERTIES_SCOPE') ?? [
        NationalRegistryScope.properties,
        'api_resource.scope',
      ],
    }
  },
})
