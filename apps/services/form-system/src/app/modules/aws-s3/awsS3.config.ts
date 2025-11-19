import { defineConfig } from '@island.is/nest/config'

export const awsS3ModuleConfig = defineConfig({
  name: 'AwsS3Module',
  load: (env) => ({
    bucket: env.required('S3_BUCKET', 'island-is-dev-storage-form-system'),
  }),
})
