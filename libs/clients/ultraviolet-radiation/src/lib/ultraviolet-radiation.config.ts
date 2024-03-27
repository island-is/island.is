import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  apiKey: z.string(),
})

export const UltravioletRadiationClientConfig = defineConfig({
  name: 'UltravioletRadiationClientConfig',
  schema,
  load(env) {
    return {
      apiKey: env.required('ULTRAVIOLET_RADIATION_API_KEY'), // TODO: should I add an empty string fallback?
    }
  },
})
