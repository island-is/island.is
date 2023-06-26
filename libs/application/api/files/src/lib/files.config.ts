import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { z } from 'zod'

const ApplicationFilesModule = z.object({
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
    attachmentBucket: env.optional(
      'APPLICATION_ATTACHMENT_BUCKET',
      'island-is-dev-upload-api',
    ),
    presignBucket: env.optional(
      'FILE_SERVICE_PRESIGN_BUCKET',
      'island-is-dev-storage-application-system',
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
      ssl: !isRunningOnEnvironment('local'),
    },
  }),
})
