import { defineConfig } from '@island.is/nest/config'

export const awsS3ModuleConfig = defineConfig({
  name: 'AwsS3Module',
  load: (env) => ({
    region: env.required('S3_REGION', 'eu-west-1'),
    bucket: env.required('S3_BUCKET', 'island-is-dev-storage-form-system'),
    timeToLivePost: +env.required('S3_TIME_TO_LIVE_POST', '15'), // 15 seconds, convert to number with +
    timeToLiveGet: +env.required('S3_TIME_TO_LIVE_GET', '5'), // 5 seconds, convert to number with +
  }),
})
