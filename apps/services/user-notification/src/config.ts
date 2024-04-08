import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'
import { processJob } from '@island.is/infra-nest-server'

const schema = z.object({
  appProtocol: z.string(),
  isWorker: z.boolean(),
  firebaseCredentials: z.object({
    type: z.string(),
    project_id: z.string(),
    private_key_id: z.string(),
    private_key: z.string(),
    client_email: z.string(),
    client_id: z.string(),
    auth_uri: z.string(),
    token_uri: z.string(),
    auth_provider_x509_cert_url: z.string(),
    client_x509_cert_url: z.string(),
  }),
  servicePortalClickActionUrl: z.string(),
  contentfulAccessToken: z.string(),
})

export const UserNotificationsConfig = defineConfig({
  name: 'UserNotificationsApi',
  schema,
  load(env) {
    return {
      appProtocol: env.required(
        'USER_NOTIFICATION_APP_PROTOCOL',
        'is.island.app.dev',
      ),
      isWorker: processJob() === 'worker',
      firebaseCredentials: env.requiredJSON('FIREBASE_CREDENTIALS'),
      servicePortalClickActionUrl:
        env.optional('SERVICE_PORTAL_CLICK_ACTION_URL') ??
        'https://island.is/minarsidur',
      contentfulAccessToken: env.optional('CONTENTFUL_ACCESS_TOKEN'),
    }
  },
})
