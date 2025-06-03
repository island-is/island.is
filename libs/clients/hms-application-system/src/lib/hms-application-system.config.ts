import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadPath: z.string(),
  fetchTimeout: z.number().int(),
})

export const HmsApplicationSystemConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HmsApplicationSystemClient',
  schema,
  load(env) {
    return {
      xRoadPath: env.required(
        'XROAD_HMS_APPLICATION_SYSTEM_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/formbuilder-v1',
      ),
      fetchTimeout:
        env.optionalJSON('XROAD_HMS_APPLICATION_SYSTEM_TIMEOUT') ?? 15000,
    }
  },
})
