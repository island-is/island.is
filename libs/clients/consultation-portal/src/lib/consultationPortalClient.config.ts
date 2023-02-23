import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config';

const schema = z.object({
  basePath: z.string(),
  cacheControl: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
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
      redis: {
        nodes: env.optionalJSON('CONSULTATION_PORTAL_CLIENT_REDIS_NODES') ?? [],
        ssl:
          env.optionalJSON('CONSULTATION_PORTAL_CLIENT_REDIS_SSL', false) ??
          true,
      },
    }
  },
})
