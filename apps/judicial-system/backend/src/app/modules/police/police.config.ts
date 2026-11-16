import { defineConfig } from '@island.is/nest/config'

export const policeModuleConfig = defineConfig({
  name: 'PoliceModule',
  load: (env) => ({
    tlsBasePathWithEnv: env.required('XROAD_TLS_BASE_PATH_WITH_ENV', ''),
    clientId: env.required('XROAD_CLIENT_ID', ''),
    clientCert: env.required('XROAD_CLIENT_CERT', ''),
    clientKey: env.required('XROAD_CLIENT_KEY', ''),
    clientPem: env.required('XROAD_CLIENT_PEM', ''),
    policeApiPath: env.required('XROAD_POLICE_API_PATH', ''),
    policeMemberCode: env.required('XROAD_POLICE_MEMBER_CODE', ''),
    policeCaseApiAvailable: !(env.optional('BLOCKED_API_INTEGRATION') ?? '')
      .split(',')
      .includes('POLICE_CASE'),
    policeApiKey: env.required('XROAD_POLICE_API_KEY', ''),
    fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
    fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
    replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
    replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
  }),
})
