import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  url: z.string(),
})

export const UmbodsmadurSkuldaraClientConfig = defineConfig({
  name: 'UmbodsmadurSkuldaraApi',
  schema,
  load(env) {
    return {
      url: env.required(
        'UMBODSMADUR_SKULDARA_COST_OF_LIVING_CALCULATOR_API_URL',
      ),
    }
  },
})
