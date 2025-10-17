import { defineConfig } from '@island.is/nest/config'

export const repositoryModuleConfig = defineConfig({
  name: 'RepositoryModule',
  load: (env) => ({
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
  }),
})
