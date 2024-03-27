import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  scope: z.array(z.string()),
})

export const UserNotificationClientConfig = defineConfig({
  name: 'UserNotificationConfig',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'USER_NOTIFICATION_API_URL',
        'http://localhost:8080',
      ),
      scope: ['api_resource.scope'],
    }
  },
})
