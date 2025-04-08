import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseUrl: z.string().url(),
  apiKey: z.string(),
})

export const BloodClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'BloodClientConfig',
  schema,
  load(env) {
    return {
      baseUrl: env.required(
        'LSH_BLOOD_URL',
        'https://externalpatientdev.landspitali.is/swagger/index.html',
      ),
      apiKey: env.required('LSH_BLOOD_API_KEY', ''),
    }
  },
})
