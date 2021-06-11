import { XRoadMemberClass } from '@island.is/utils/api'

const devConfig = {
  production: false,
  auth: {
    audience: '@identityserver.api',
    issuer: 'https://localhost:6001',
  },
  port: 4333,
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
    xroad: {
      basePath: process.env.XROAD_BASE_PATH_WITH_ENV,
      memberClass: XRoadMemberClass.GovernmentInstitution,
      memberCode: process.env.XROAD_NATIONAL_REGISTRY_MEMBER_CODE,
      apiPath: process.env.XROAD_NATIONAL_REGISTRY_API_PATH,
      clientId: process.env.XROAD_NATIONAL_REGISTRY_CLIENT_ID,
    },
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
    xroad: {
      basePath: process.env.XROAD_BASE_PATH_WITH_ENV,
      memberClass: XRoadMemberClass.GovernmentInstitution,
      memberCode: process.env.XROAD_NATIONAL_REGISTRY_MEMBER_CODE,
      apiPath: process.env.XROAD_NATIONAL_REGISTRY_API_PATH,
      clientId: process.env.XROAD_NATIONAL_REGISTRY_CLIENT_ID,
    },
    authMiddlewareOptions: {
      forwardUserInfo: false,
    },
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
