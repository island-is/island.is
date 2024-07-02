import { defineConfig } from '@island.is/nest/config'

export const courtModuleConfig = defineConfig({
  name: 'CourtModule',
  load: (env) => ({
    useMicrosoftGraphApiForCourtRobot:
      env.required('USE_MICROSOFT_GRAPH_API_FOR_COURT_ROBOT', 'false') ===
      'true',
    courtRobotClientId: env.optional('COURT_ROBOT_CLIENT_ID'),
    courtRobotTenantId: env.optional('COURT_ROBOT_TENANT_ID'),
    courtRobotClientSecret: env.optional('COURT_ROBOT_CLIENT_SECRET'),
    courtRobotUser: env.optional('COURT_ROBOT_USER'),
    courtRobotEmail: env.required('COURT_ROBOT_EMAIL', 'ben10@omnitrix.is'),
    courtRobotName: 'Court Robot',
    fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
    fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
    replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
    replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
  }),
})
