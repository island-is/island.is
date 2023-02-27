import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
  cacheControl: z.string(),
})

export const ConsultationPortalClientConfig = defineConfig({
  name: 'ConsultationPortalApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'CONSULTATION_PORTAL_CLIENT_BASE_PATH',
        'https://samradapi-test.island.is',
      ),

      cacheControl:
        env.optional('CONSULTATION_PORTAL_CLIENT_CACHE_CONTROL') ??
        'private, max-age=600', // 10 minutes,
    }
  },
})
