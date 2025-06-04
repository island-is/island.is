import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  servicePath: z.string(),
})

export const HmsApplicationSystemConfig = defineConfig({
  name: 'HmsApplicationSystemClient',
  schema,
  load(env) {
    return {
      servicePath: env.required(
        'HMS_APPLICATION_SYSTEM_SERVICE_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/formbuilder-v1',
      ),
    }
  },
})
