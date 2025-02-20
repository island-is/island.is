import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseUrl: z.string().url(),
})

export const RannisGrantsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RannisGrantsClientConfig',
  schema,
  load(env) {
    return {
      baseUrl: env.required(
        'RANNIS_GRANTS_URL',
        'https://sjodir.rannis.is/statistics/fund_schedule.php',
      ),
    }
  },
})
