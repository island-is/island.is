import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const FileStorageModule = z.object({
  uploadBucket: z.string(),
  secondUploadBucket: z.string(),
})

export const FileStorageConfig = defineConfig({
  name: 'FileStorageModule',
  schema: FileStorageModule,
  load: (env) => ({
    uploadBucket: env.optional(
      'FILE_STORAGE_UPLOAD_BUCKET',
      'island-is-dev-upload-api',
    ),
    secondUploadBucket: env.optional(
      'APPLICATION_ATTACHMENT_BUCKET',
      'bruh'
    ),
  }),
})
