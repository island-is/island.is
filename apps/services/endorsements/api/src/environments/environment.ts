import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

declare const process: {
  env: {
    [key: string]: string
  }
}

const isProductionEnvironment = process.env.NODE_ENV === 'production'
const devConfig = {
  production: isProductionEnvironment,
  metadataProvider: {
    nationalRegistry: {
      xRoadPath: createXRoadAPIPath(
        'http://localhost:8081/r1/IS-DEV',
        XRoadMemberClass.GovernmentInstitution,
        '10001',
        '/SKRA-Protected/Einstaklingar-v1',
      ),
      xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
    },
    authMiddlewareOptions: {
      forwardUserInfo: false,
      tokenExchangeOptions: {
        issuer: 'https://identity-server.dev01.devland.is',
        clientId: '@island.is/clients/national-registry',
        clientSecret: process.env.NATIONAL_REGISTRY_IDS_CLIENT_SECRET,
        scope: 'openid @skra.is/individuals api_resource.scope',
        requestActorToken: true,
      },
    },

    temporaryVoterRegistry: {
      baseApiUrl: 'http://localhost:4248',
    },
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
    clientId: '', // for updateMetadata script
    clientSecret: '', // for updateMetadata script
  },
  apiMock: process.env.API_MOCKS === 'true',
  audit: {
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  accessGroups: {
    DMR: process.env.ACCESS_GROUP_DMR ?? '',
  },
}

const prodConfig = {
  production: isProductionEnvironment,
  metadataProvider: {
    nationalRegistry: {
      xRoadPath: createXRoadAPIPath(
        process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
        XRoadMemberClass.GovernmentInstitution,
        process.env.XROAD_NATIONAL_REGISTRY_MEMBER_CODE ?? '',
        process.env.XROAD_NATIONAL_REGISTRY_API_PATH ?? '',
      ),
      xRoadClient: process.env.XROAD_NATIONAL_REGISTRY_CLIENT_ID ?? '',
    },
    authMiddlewareOptions: {
      forwardUserInfo: false,
      tokenExchangeOptions: {
        issuer: process.env.IDS_ISSUER,
        clientId: '@island.is/clients/national-registry',
        clientSecret: process.env.NATIONAL_REGISTRY_IDS_CLIENT_SECRET,
        scope: 'openid @skra.is/individuals api_resource.scope',
        requestActorToken: true,
      },
    },
    temporaryVoterRegistry: {
      baseApiUrl: process.env.TEMPORARY_VOTER_REGISTRY_API_URL,
    },
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
    clientId: '', // for updateMetadata script
    clientSecret: '', // for updateMetadata script
  },
  apiMock: false,
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-endorsements-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  accessGroups: {
    DMR: process.env.ACCESS_GROUP_DMR ?? '',
  },
}

export default isProductionEnvironment ? prodConfig : devConfig
