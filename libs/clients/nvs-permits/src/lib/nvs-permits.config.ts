import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
})

export const NvsPermitsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'NvsPermitsClientConfig',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_NVS_PERMITS_PATH',
        'IS-DEV/GOV/10085/NVS-Protected/api',
      ),
    }
  },
})
