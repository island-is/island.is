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
    dokobitAccessToken: env.optional('DOKOBIT_ACCESS_TOKEN'),
    deepLinks: {
      completedCaseOverviewUrl: env.required(
        'COMPLETED_CASE_OVERVIEW_URL',
        'http://localhost:4200/krafa/yfirlit/',
      ),
      defenderCaseOverviewUrl: env.required(
        'DEFENDER_CASE_OVERVIEW_URL',
        'http://localhost:4200/verjandi/',
      ),
    },
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
  }),
})
