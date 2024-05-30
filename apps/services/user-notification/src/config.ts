import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'
import { processJob } from '@island.is/infra-nest-server'

// Exported for testing purposes
export const schema = z.object({
  isWorker: z.boolean(),
  firebaseCredentials: z.string(),
  servicePortalClickActionUrl: z.string(),
  contentfulAccessToken: z.string(),
  emailFromAddress: z.string(),
})

export const UserNotificationsConfig = defineConfig({
  name: 'UserNotificationsApi',
  schema,
  load(env) {
    return {
      isWorker: processJob() === 'worker',
      firebaseCredentials: env.required('FIREBASE_CREDENTIALS', ''),
      servicePortalClickActionUrl:
        env.optional('SERVICE_PORTAL_CLICK_ACTION_URL') ??
        'https://island.is/minarsidur',
      contentfulAccessToken: env.optional('CONTENTFUL_ACCESS_TOKEN', ''),
      emailFromAddress: env.required(
        'EMAIL_FROM_ADDRESS',
        'development@island.is',
      ),
    }
  },
})
