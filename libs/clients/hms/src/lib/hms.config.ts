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

// -------------- Leiguskrá --------------
// DEV
// Header: X-Road-Client : IS-DEV/GOV/10000/island-is-client
// Leigusamningar: /r1/IS-DEV/GOV/10033/HMS-Protected/Leigusamningar-v1

// STAGE
// Header: X-Road-Client : IS-TEST/GOV/5501692829/test-client
// Leigusamningar: /r1/IS-TEST/GOV/5812191480/HMS-Protected/Leigusamningar-v1

// PROD
// Header: X-Road-Client : IS/GOV/5501692829/island-is-client
// Leigusamningar: ??
