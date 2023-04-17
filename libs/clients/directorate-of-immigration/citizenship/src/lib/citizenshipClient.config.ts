import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const CitizenshipClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'CitizenshipClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_CITIZENSHIP_PATH',
        'IS-DEV/GOV/10017/Utlendingastofnun-Protected/Citizenship-V1',
      ),
      scope: ['@utlendingastofnun/rikisborgararettur'],
    }
  },
})
