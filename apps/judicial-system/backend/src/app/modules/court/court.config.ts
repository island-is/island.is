import { defineConfig } from '@island.is/nest/config'

export const courtModuleConfig = defineConfig({
  name: 'CourtModule',
  load: (env) => ({
    fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
    fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
    replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
    replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
    courtRobotEmail: env.required('COURT_ROBOT_EMAIL', 'ben10@omnitrix.is'),
    courtRobotName: 'Court Robot',
  }),
})
