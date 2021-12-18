import { XRoadMemberClass } from '@island.is/shared/utils/server'

const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-public-api',
  },
  auth: {
    issuer: 'https://localhost:6001',
    audience: '@island.is',
  },
  port: 3370,
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
      basePath: 'http://localhost:8081/r1/IS-DEV',
      memberCode: '10001',
      apiPath: '/SKRA-Protected/Einstaklingar-v1',
      clientId: 'IS-DEV/GOV/10000/island-is-client',
      memberClass: XRoadMemberClass.GovernmentInstitution,
    },
    authMiddlewareOptions: {
      forwardUserInfo: false,
      tokenExchangeOptions: {
        issuer: 'https://identity-server.dev01.devland.is',
        clientId: '@island.is/clients/national-registry',
        clientSecret: process.env.NATIONAL_REGISTRY_IDS_CLIENT_SECRET,
        scope: 'openid @skra.is/individuals api_resource.scope', // TODO: remove api_resource.scope
        requestActorToken: true,
      },
    },
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/auth-public-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-public-api',
  },
  auth: {
    audience: '@island.is',
    issuer: process.env.IDS_ISSUER,
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
      tokenExchangeOptions: {
        issuer: process.env.IDS_ISSUER,
        clientId: '@island.is/clients/national-registry',
        clientSecret: process.env.NATIONAL_REGISTRY_IDS_CLIENT_SECRET,
        scope: 'openid @skra.is/individuals api_resource.scope', // TODO: remove api_resource.scope
        requestActorToken: true,
      },
    },
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
