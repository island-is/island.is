import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  servicePath: z.string(),
  xRoadClientHeader: z.string(),
})

export const HmsApplicationSystemConfig = defineConfig({
  name: 'HmsApplicationSystemClient',
  schema,
  load(env) {
    return {
      servicePath: env.required(
        'XROAD_HMS_APPLICATION_SYSTEM_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/formbuilder-v1',
      ),
      xRoadClientHeader: env.required(
        'XROAD_HMS_APPLICATION_SYSTEM_CLIENT_HEADER',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      tokenExchangeScope: [],
    }
  },
})
