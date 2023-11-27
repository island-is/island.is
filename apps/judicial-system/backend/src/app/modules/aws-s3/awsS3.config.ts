import { defineConfig } from '@island.is/nest/config'

export const awsS3ModuleConfig = defineConfig({
  name: 'AwsS3Module',
  load: (env) => ({
    region: env.required('S3_REGION', 'eu-west-1'),
    bucket: env.required('S3_BUCKET', 'island-is-dev-upload-judicial-system'),
    timeToLivePost: env.required('S3_TIME_TO_LIVE_POST', '15'),
    timeToLiveGet: env.required('S3_TIME_TO_LIVE_GET', '5'),
  }),
})
