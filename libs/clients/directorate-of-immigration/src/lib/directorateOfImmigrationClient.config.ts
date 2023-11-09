import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const DirectorateOfImmigrationClientConfig = defineConfig({
  name: 'DirectorateOfImmigrationApi',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_DIRECTORATE_OF_IMMIGRATION_PATH',
        'IS-DEV/GOV/10011/UTL-Protected/Utl-Umsokn-v1',
      ),
      scope: ['@utl.is/umsoknir'],
    }
  },
})
