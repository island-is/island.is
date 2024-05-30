import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
})

export const DelegationApiUserSystemNotificationConfig = defineConfig({
  name: 'DelegationApiUserSystemNotificationConfig',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'USER_NOTIFICATION_API_URL',
        'http://localhost:3333',
      ),
    }
  },
})
