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
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const UserNotificationsConfig = defineConfig({
  name: 'UserNotificationsApi',
  schema,
  load(env) {
    const isWorker = processJob() === 'worker'
    return {
      isWorker,
      firebaseCredentials: env.required('FIREBASE_CREDENTIALS', ''),
      servicePortalClickActionUrl:
        env.optional('SERVICE_PORTAL_CLICK_ACTION_URL') ??
        'https://island.is/minarsidur',
      contentfulAccessToken: env.optional('CONTENTFUL_ACCESS_TOKEN', ''),
      emailFromAddress: env.required(
        'EMAIL_FROM_ADDRESS',
        'development@island.is',
      ),
      redis: {
        nodes: env.requiredJSON('REDIS_URL_NODE_01', [
          'localhost:7000',
          'localhost:7001',
          'localhost:7002',
          'localhost:7003',
          'localhost:7004',
          'localhost:7005',
        ]),
        ssl: env.requiredJSON('REDIS_USE_SSL', false),
      },
    }
  },
})
