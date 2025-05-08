import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadPath: z.string(),
  xRoadClientHeader: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
})

export const HmsConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HmsClient',
  schema,
  load(env) {
    return {
      xRoadPath: env.required(
        'XROAD_HMS_PROPERTY_SEARCH_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/fasteignir-v2-beta',
      ),
      xRoadClientHeader: env.required(
        'XROAD_HMS_PROPERTY_SEARCH_CLIENT_HEADER',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      fetchTimeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 15000,
      tokenExchangeScope: [],
    }
  },
})
