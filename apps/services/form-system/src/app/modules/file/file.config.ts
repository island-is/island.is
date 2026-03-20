import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const FormSystemFilesSchema = z.object({
  region: z.string(),
  timeToLivePost: z.number(),
  timeToLiveGet: z.number(),
  bucket: z.string(),
})

export const FileConfig = defineConfig({
  name: 'FormSystemFiles',
  schema: FormSystemFilesSchema,
  load: (env) => ({
    region: env.required('S3_REGION', 'eu-west-1'),
    timeToLivePost: +env.required('S3_TIME_TO_LIVE_POST', '15'), // 15 seconds, convert to number with +
    timeToLiveGet: +env.required('S3_TIME_TO_LIVE_GET', '5'), // 5 seconds, convert to number with +
    bucket:
      env.optional('FORM_SYSTEM_BUCKET') ??
      'island-is-dev-form-system-presign-bucket',
  }),
})
