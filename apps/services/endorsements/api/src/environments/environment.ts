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
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  metadataProvider: {
    nationalRegistry: {
      xRoadPath: createXRoadAPIPath(
        'http://localhost:8081/r1/IS-DEV',
        XRoadMemberClass.GovernmentInstitution,
        '10001',
        '/SKRA-Protected/Einstaklingar-v1',
      ),
      xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
      clientSecret: process.env.NATIONAL_REGISTRY_IDS_CLIENT_SECRET,
    },

    temporaryVoterRegistry: {
      baseApiUrl: 'http://localhost:4248',
    },
  },
  endorsementListProvider: {
    nationalRegistry: {
      baseSoapUrl: 'https://localhost:8443',
      user: process.env.SOFFIA_USER ?? '',
      password: process.env.SOFFIA_PASS ?? '',
      host: 'soffiaprufa.skra.is',
    },
  },
  endorsementClient: {
    clientId: process.env.ENDORSEMENT_CLIENT_ID,
    clientSecret: process.env.ENDORSEMENT_CLIENT_SECRET,
  },
  apiMock: process.env.API_MOCKS === 'true',
  audit: {
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  accessGroups: {
    DMR: process.env.ACCESS_GROUP_DMR ?? '',
    Admin: process.env.ACCESS_GROUP_ADMIN ?? '',
  },
  emailOptions: {
    useTestAccount: true,
    useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
  },
}

const prodConfig = {
  production: isProductionEnvironment,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
  },
  metadataProvider: {
    nationalRegistry: {
      xRoadPath: createXRoadAPIPath(
        process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
        XRoadMemberClass.GovernmentInstitution,
        process.env.XROAD_NATIONAL_REGISTRY_MEMBER_CODE ?? '',
        process.env.XROAD_NATIONAL_REGISTRY_API_PATH ?? '',
      ),
      xRoadClient: process.env.XROAD_NATIONAL_REGISTRY_CLIENT_ID ?? '',
      clientSecret: process.env.NATIONAL_REGISTRY_IDS_CLIENT_SECRET,
    },
    temporaryVoterRegistry: {
      baseApiUrl: process.env.TEMPORARY_VOTER_REGISTRY_API_URL,
    },
  },
  endorsementListProvider: {
    nationalRegistry: {
      baseSoapUrl: process.env.SOFFIA_SOAP_URL,
      user: process.env.SOFFIA_USER,
      password: process.env.SOFFIA_PASS,
      host: process.env.SOFFIA_HOST_URL,
    },
  },
  endorsementClient: {
    clientId: process.env.ENDORSEMENT_CLIENT_ID,
    clientSecret: process.env.ENDORSEMENT_CLIENT_SECRET,
  },
  apiMock: false,
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-endorsements-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  accessGroups: {
    DMR: process.env.ACCESS_GROUP_DMR ?? '',
    Admin: process.env.ACCESS_GROUP_ADMIN ?? '',
  },
  emailOptions: {
    useTestAccount: false,
    useNodemailerApp: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
  },
}

export default isProductionEnvironment ? prodConfig : devConfig

// global settings for endorsementsystem
export const ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS = ['generalPetition']
