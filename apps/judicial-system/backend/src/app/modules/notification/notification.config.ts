import { defineConfig } from '@island.is/nest/config'

export const notificationModuleConfig = defineConfig({
  name: 'NotificationModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    courtOfAppealsId: '4676f08b-aab4-4b4f-a366-697540788088',
    shouldUseWhitelist:
      env.required('CONTENTFUL_ENVIRONMENT', 'test') !== 'master',
    email: {
      fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
      fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
      replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
      replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
      prisonEmail: env.required('PRISON_EMAIL', 'jl+d+prison@kolibri.is'),
      prisonAdminEmail: env.required(
        'PRISON_ADMIN_EMAIL',
        'jl+d+prisonAdmin@kolibri.is',
      ),
      prisonAdminIndictmentEmails: env.required(
        'PRISON_ADMIN_INDICTMENT_EMAILS',
        'jl+d+prisonAdminIndictment@kolibri.is',
      ),
      publicProsecutorCriminalRecordsEmail: env.required(
        'PUBLIC_PROSECUTOR_CRIMINAL_RECORDS_EMAIL',
        'jl+d+publicProsecutorCriminalRecord@kolibri.is',
      ),
      courtsEmails: env.requiredJSON('COURTS_EMAILS', {
        'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf': 'jl+d+court@kolibri.is',
      }) as {
        [key: string]: string
      },
      courtOfAppealsAssistantEmails: env.required(
        'COURT_OF_APPEALS_ASSISTANT_EMAILS',
        'jl+d+courtOfAppeals@kolibri.is',
      ),
      policeInstitutionEmails: env.requiredJSON('POLICE_INSTITUTIONS_EMAILS', {
        '53581d7b-0591-45e5-9cbe-c96b2f82da85':
          'jl+d+policeInstitution@kolibri.is',
      }) as {
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
