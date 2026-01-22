import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { z } from 'zod'

const FormSystemFilesSchema = z.object({
  region: z.string(),
  timeToLivePost: z.number(),
  timeToLiveGet: z.number(),
  bullModuleName: z.string(),
  uploadBucket: z.string(),
  bucket: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const FileConfig = defineConfig({
  name: 'FormSystemFiles',
  schema: FormSystemFilesSchema,
  load: (env) => ({
    region: env.required('S3_REGION', 'eu-west-1'),
    timeToLivePost: +env.required('S3_TIME_TO_LIVE_POST', '15'), // 15 seconds, convert to number with +
    timeToLiveGet: +env.required('S3_TIME_TO_LIVE_GET', '5'), // 5 seconds, convert to number with +
    bullModuleName:
      env.optional('FORM_SYSTEM_BULL_PREFIX') ?? 'form-system-upload',
    uploadBucket:
      env.optional('FILE_STORAGE_UPLOAD_BUCKET') ?? 'island-is-dev-upload-api',
    bucket:
      env.optional('FORM_SYSTEM_BUCKET') ??
      'island-is-dev-form-system-presign-bucket',
    redis: {
      nodes: env.requiredJSON('REDIS_URL_NODE_01', [
        'localhost:7010',
        'localhost:7011',
        'localhost:7012',
      ]),
      ssl: !isRunningOnEnvironment('local'),
    },
  }),
})
