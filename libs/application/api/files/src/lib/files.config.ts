import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { z } from 'zod'

const ApplicationFilesModule = z.object({
  bullModuleName: z.string(),
  attachmentBucket: z.string(),
  presignBucket: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const ApplicationFilesConfig = defineConfig({
  name: 'ApplicationFilesModule',
  schema: ApplicationFilesModule,
  load: (env) => ({
    bullModuleName:
      env.optional('APPLICATION_SYSTEM_BULL_PREFIX') ??
      'application_system_api_bull_module',
    attachmentBucket:
      env.optional('APPLICATION_ATTACHMENT_BUCKET') ??
      'island-is-dev-upload-api',
    presignBucket:
      env.optional('FILE_SERVICE_PRESIGN_BUCKET') ??
      'island-is-dev-storage-application-system',
    redis: {
      nodes: env.requiredJSON('REDIS_URL_NODE_01', [
        'localhost:7010',
        'localhost:7011',
        'localhost:7012',
        'localhost:7013',
        'localhost:7014',
        'localhost:7015',
      ]),
      ssl: !isRunningOnEnvironment('local'),
    },
  }),
})
