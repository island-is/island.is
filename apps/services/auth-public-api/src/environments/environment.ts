import { XRoadMemberClass } from '@island.is/utils/api'

export default {
  production: false,
  auth: {
    issuer: 'https://localhost:6001',
    jwksUri: 'http://localhost:6002/.well-known/openid-configuration/jwks',
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
}
