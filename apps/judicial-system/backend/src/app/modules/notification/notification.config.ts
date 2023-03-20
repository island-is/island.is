import { defineConfig } from '@island.is/nest/config'

export const notificationModuleConfig = defineConfig({
  name: 'NotificationModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    email: {
      fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
      fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
      replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
      replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
      prisonEmail: env.required('PRISON_EMAIL', ''),
      prisonAdminEmail: env.required('PRISON_ADMIN_EMAIL', ''),
    },
    sms: {
      courtsMobileNumbers: env.requiredJSON('COURTS_MOBILE_NUMBERS', {}) as {
        [key: string]: string
      },
    },
    clientUrl: env.required('CLIENT_URL', 'http://localhost:4200'),
  }),
})
