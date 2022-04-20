import { defineConfig } from '@island.is/nest/config'

export const caseModuleConfig = defineConfig({
  name: 'CaseModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
  }),
})
