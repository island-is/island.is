import { defineConfig } from '@island.is/nest/config'

export const notificationModuleConfig = defineConfig({
  name: 'NotificationModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    courtOfAppealsId: '4676f08b-aab4-4b4f-a366-697540788088',
    email: {
      fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
      fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
      replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
      replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
      prisonEmail: env.required('PRISON_EMAIL', ''),
      prisonAdminEmail: env.required('PRISON_ADMIN_EMAIL', ''),
      courtsEmails: env.requiredJSON('COURTS_EMAILS', {}) as {
        [key: string]: string
      },
    },
    sms: {
      courtsMobileNumbers: env.requiredJSON('COURTS_MOBILE_NUMBERS', {}) as {
        [key: string]: string
      },
      courtsAssistantMobileNumbers: env.requiredJSON(
        'COURTS_ASSISTANT_MOBILE_NUMBERS',
        {},
      ) as { [key: string]: string },
    },
    clientUrl: env.required('CLIENT_URL', 'http://localhost:4200'),
  }),
})
