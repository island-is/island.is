import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  servicePath: z.string(),
})

export const ArborgWorkpoinClientConfig = defineConfig({
  name: 'WorkPointArborgClientApi',
  schema,
  load(env) {
    return {
      servicePath: env.required(
        'WORKPOINT_ARBORG_SERVICE_PATH',
        'IS-DEV/MUN/10036/Arborg-Protected/tengill-application-v1',
      ),
    }
  },
})
