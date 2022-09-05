import { defineConfig } from '@island.is/nest/config'

export const courtClientModuleConfig = defineConfig({
  name: 'CourtClientModule',
  load: (env) => ({
    tlsBasePathWithEnv: env.required('XROAD_TLS_BASE_PATH_WITH_ENV', ''),
    clientId: env.required('XROAD_CLIENT_ID', ''),
    clientCert: env.required('XROAD_CLIENT_CERT', ''),
    clientKey: env.required('XROAD_CLIENT_KEY', ''),
    clientPem: env.required('XROAD_CLIENT_PEM', ''),
    courtMemberCode: env.required('XROAD_COURT_MEMBER_CODE', ''),
    courtApiPath: env.required('XROAD_COURT_API_PATH', ''),
    courtsCredentials: env.requiredJSON('XROAD_COURTS_CREDENTIALS', {}),
    courtApiAvailable: !(env.optional('BLOCKED_API_INTEGRATION') ?? '')
      .split(',')
      .includes('COURT'),
  }),
})
