import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  username: z.string(),
  password: z.string(),
  apiKey: z.string(),
})

export const CustomsGeneralClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'CustomsGeneralClientConfig',
  schema,
  load: (env) => ({
    baseUrl: env.required(
      'TOLLUR_ALMENNT_BASE_URL',
      'https://apptorg.hysing.is/gateway/tollur-almennt/v1',
    ),
    username: env.required('TOLLUR_ALMENNT_USERNAME'),
    password: env.required('TOLLUR_ALMENNT_PASSWORD'),
    apiKey: env.required('TOLLUR_ALMENNT_API_KEY'),
  }),
})
