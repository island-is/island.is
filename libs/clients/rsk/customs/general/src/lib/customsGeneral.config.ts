import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  username: z.string(),
  password: z.string(),
  apiKey: z.string(),
  assessmentLocationsBaseUrl: z.string().optional(),
})

export const CustomsGeneralClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'CustomsGeneralClientConfig',
  schema,
  load: (env) => ({
    baseUrl: env.required(
      'SKATTUR_TOLLUR_ALMENNT_BASE_URL',
      'https://skatt-test.hysing.is/gateway/tollur-almennt/v1',
    ),
    username: env.required('SKATTUR_TOLLUR_ALMENNT_USERNAME', ''),
    password: env.required('SKATTUR_TOLLUR_ALMENNT_PASSWORD', ''),
    apiKey: env.required('SKATTUR_TOLLUR_ALMENNT_API_KEY', ''),
    // Temporary: point Akvordunarstadir at another environment until the
    // production endpoint is live. Unset means "use baseUrl".
    assessmentLocationsBaseUrl: env.optional(
      'SKATTUR_TOLLUR_ALMENNT_AKVORDUNARSTADIR_BASE_URL',
    ),
  }),
})
