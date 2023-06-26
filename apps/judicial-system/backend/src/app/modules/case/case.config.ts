import { defineConfig } from '@island.is/nest/config'

export const caseModuleConfig = defineConfig({
  name: 'CaseModule',
  load: (env) => ({
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
  }),
})
