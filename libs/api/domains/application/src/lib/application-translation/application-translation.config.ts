import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  baseApiUrl: z.string(),
})

export const ApplicationTranslationConfig = defineConfig({
  name: 'ApplicationTranslationConfig',
  schema,
  load: (env) => ({
    baseApiUrl: env.required('APPLICATION_SYSTEM_API_URL'),
  }),
})
