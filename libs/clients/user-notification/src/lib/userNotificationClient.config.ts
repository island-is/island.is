import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schemaWithoutScope = z.object({
  basePath: z.string(),
})

const schemaWithScope = schemaWithoutScope.extend({
  scope: z.array(z.string()),
})

export const UserNotificationSystemClientConfig = defineConfig({
  name: 'UserNotificationSystemConfig',
  schema: schemaWithoutScope,
  load(env) {
    return {
      basePath: env.required(
        'USER_NOTIFICATION_CLIENT_URL',
        'http://localhost:3333',
      ),
    }
  },
})

export const UserNotificationClientConfig = defineConfig({
  name: 'UserNotificationConfig',
  schema: schemaWithScope,
  load(env) {
    return {
      basePath: env.required(
        'USER_NOTIFICATION_CLIENT_URL',
        'http://localhost:3333',
      ),
      scope: ['api_resource.scope'],
    }
  },
})
