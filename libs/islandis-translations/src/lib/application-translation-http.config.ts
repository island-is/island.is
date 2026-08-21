import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  baseApiUrl: z.string(),
})

export const ApplicationTranslationHttpConfig = defineConfig({
  name: 'ApplicationTranslationHttpConfig',
  schema,
  load: (env) => ({
    baseApiUrl: env.required(
      'APPLICATION_SYSTEM_API_URL',
      'http://localhost:3333',
    ),
  }),
})
