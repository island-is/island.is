import { defineConfig } from '@island.is/nest/config'

export const criminalRecordModuleConfig = defineConfig({
  name: 'CriminalRecordModule',
  load: (env) => ({
    tlsBasePathWithEnv: env.required('XROAD_TLS_BASE_PATH_WITH_ENV', ''),
    clientId: env.required('XROAD_CLIENT_ID', ''),
    clientCert: env.required('XROAD_CLIENT_CERT', ''),
    clientKey: env.required('XROAD_CLIENT_KEY', ''),
    clientPem: env.required('XROAD_CLIENT_PEM', ''),
    dmrCriminalRecordApiPath: env.required(
      'XROAD_DMR_CRIMINAL_RECORD_API_PATH',
      '',
    ),
    dmrMemberCode: env.required('XROAD_DMR_MEMBER_CODE', ''),
  }),
})
