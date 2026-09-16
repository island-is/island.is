import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  apiKey: z.string().optional(),
  apiUrl: z.string(),
})

export const GoogleTranslateConfig = defineConfig({
  name: 'GoogleTranslateConfig',
  schema,
  load: (env) => ({
    apiKey: env.optional('FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY'),
    apiUrl: env.required(
      'GOOGLE_TRANSLATE_API_URL',
      'https://translation.googleapis.com/language/translate/v2',
    ),
  }),
})
