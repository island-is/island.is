import { XRoadMemberClass } from '@island.is/shared/utils/server'

const devConfig = {
  production: false,
  auth: {
    audience: '@identityserver.api',
    issuer: 'https://localhost:6001',
  },
  port: 4333,
  rsk: {
    xroad: {
      basePath: 'http://localhost:8081/r1/IS-DEV',
      memberClass: XRoadMemberClass.GovernmentInstitution,
      memberCode: '10006',
      apiPath:
        '/Skatturinn-Protected/company-registry-v1/api/companyregistry/members',
      clientId: 'IS-DEV/GOV/10000/island-is-client',
    },
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_PASSWORD,
  },
  nationalRegistry: {
    authMiddlewareOptions: {
      forwardUserInfo: false,
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.IDS_ISSUER) {
    throw new Error('Missing IDS_ISSUER environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    audience: '@identityserver.api',
    issuer: process.env.IDS_ISSUER!,
  },
  port: 3333,
  rsk: {
    xroad: {
      basePath: process.env.XROAD_BASE_PATH_WITH_ENV,
      memberClass: XRoadMemberClass.GovernmentInstitution,
      memberCode: process.env.XROAD_RSK_MEMBER_CODE,
      apiPath: process.env.XROAD_RSK_API_PATH,
      clientId: process.env.XROAD_RSK_CLIENT_ID,
    },
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_PASSWORD,
  },
  nationalRegistry: {
    authMiddlewareOptions: {
      forwardUserInfo: false,
    },
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
