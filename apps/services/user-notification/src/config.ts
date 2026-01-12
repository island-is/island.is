import { z } from 'zod'

import { processJob } from '@island.is/infra-nest-server'
import { defineConfig } from '@island.is/nest/config'

// Exported for testing purposes
export const schema = z.object({
  isWorker: z.boolean(),
  firebaseCredentials: z.string(),
  servicePortalClickActionUrl: z.string(),
  servicePortalBffLoginUrl: z.string(),
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
      servicePortalBffLoginUrl:
        env.optional('SERVICE_PORTAL_BFF_LOGIN_URL') ??
        'https://island.is/bff/login',
      contentfulAccessToken: env.optional('CONTENTFUL_ACCESS_TOKEN', ''),
      emailFromAddress: env.required(
        'EMAIL_FROM_ADDRESS',
        'development@island.is',
      ),
      redis: {
        nodes: env.requiredJSON('REDIS_URL_NODE_01', [
          'localhost:7010',
          'localhost:7011',
          'localhost:7012',
          'localhost:7013',
          'localhost:7014',
          'localhost:7015',
        ]),
        ssl: env.requiredJSON('REDIS_USE_SSL', false),
      },
    }
  },
})
