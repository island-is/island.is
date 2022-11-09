import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  cacheControl: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const UserProfileClientConfig = defineConfig({
  name: 'UserProfileApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'USER_PROFILE_CLIENT_URL',
        'http://localhost:3366',
      ),
      cacheControl:
        env.optional('USER_PROFILE_CLIENT_CACHE_CONTROL') ??
        'private, max-age=600', // 10 minutes,
      redis: {
        nodes: env.optionalJSON('USER_PROFILE_CLIENT_REDIS_NODES') ?? [],
        ssl: env.optionalJSON('USER_PROFILE_CLIENT_REDIS_SSL', false) ?? true,
      },
    }
  },
})
