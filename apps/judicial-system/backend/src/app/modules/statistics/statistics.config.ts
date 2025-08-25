import { defineConfig } from '@island.is/nest/config'

export const statisticsModuleConfig = defineConfig({
  name: 'StatisticsModule',
  load: (env) => ({
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
    robotMessageDelay: +(
      (env.optional('ROBOT_MESSAGE_DELAY') ?? '300') // 5 minutes, convert to number with +
    ),
    clientUrl: env.required('CLIENT_URL', 'http://localhost:4200'),
  }),
})
