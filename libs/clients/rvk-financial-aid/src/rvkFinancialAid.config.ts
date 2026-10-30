import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const RvkFinancialAidConfig = defineConfig({
  name: 'RvkFinancialAidConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_RVK_VEITA_PATH',
        'IS-DEV/MUN/10025/rvik-veita-protected/veita-v1',
      ),
    }
  },
})
