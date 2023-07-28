import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    scope: z.array(z.string()),
  }),
})

export const WorkMachinesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'WorkMachinesClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_WORK_MACHINE_LICENSE_PATH',
      'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/vinnuvelar-token',
    ),
    fetch: {
      scope: ['@ver.is/umsyslavinnuvela'],
    },
  }),
})
