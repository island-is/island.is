import { defineConfig } from '@island.is/nest/config'

export const fileModuleConfig = defineConfig({
  name: 'FileModule',
  load: (env) => ({
    robotS3TimeToLiveGet: +(
      (env.optional('ROBOT_S3_TIME_TO_LIVE_GET') ?? '86400') // 24 hours, convert to number with +
    ),
  }),
})
