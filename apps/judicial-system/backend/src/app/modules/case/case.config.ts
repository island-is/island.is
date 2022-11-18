import { defineConfig } from '@island.is/nest/config'

export const caseModuleConfig = defineConfig({
  name: 'CaseModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    email: {
      fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
      fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
      replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
      replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
    },
    clientUrl: env.required('CLIENT_URL', 'http://localhost:4200'),
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
  }),
})
