import { Environment } from './environment.interface'

const devConfig = {
  production: false,
  environment: 'local',
  name: 'local',
  baseApiUrl: 'http://localhost:4444',
  audit: {
    defaultNamespace: '@island.is/applications',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: ['@island.is', '@admin.island.is'],
    allowClientNationalId: true,
  },
  templateApi: {
    clientLocationOrigin: `http://localhost:${
      process.env.WEB_FRONTEND_PORT ?? '4242'
    }/umsoknir`,
    emailOptions: {
      useTestAccount: !(process.env.USE_SES === 'true'),
      useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
      options: {
        region: process.env.EMAIL_REGION ?? 'eu-west-1',
      },
    },
    email: {
      sender: 'Devland.is',
      address: 'development@island.is',
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: 'http://localhost:4444',
    smsOptions: {
      url: 'https://smsapi.devnova.is',
      username: 'IslandIs_User_Development',
      password: process.env.NOVA_PASSWORD,
      acceptUnauthorized: true,
    },
    criminalRecord: {
      clientConfig: {
        xroadClientId:
          process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
        xroadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
        xroadPath:
          process.env.XROAD_CRIMINAL_RECORD_PATH ??
          'r1/IS-DEV/GOV/10005/Logreglan-Protected/Sakavottord-PDF-v2',
      },
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    generalPetition: {
      endorsementsApiBasePath: 'http://localhost:4246',
    },
    healthInsuranceV2: {
      xRoadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
      xRoadProviderId:
        process.env.XROAD_HEALTH_INSURANCE_ID ??
        'IS-DEV/GOV/10007/SJUKRA-Protected',
      xRoadClientId:
        process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
      username: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_USERNAME ?? '',
      password: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_PASSWORD ?? '',
    },
    dataProtectionComplaint: {
      password: process.env.DATA_PROTECTION_COMPLAINT_API_PASSWORD,
      username: process.env.DATA_PROTECTION_COMPLAINT_API_USERNAME,
      XRoadProviderId: process.env.DATA_PROTECTION_COMPLAINT_XROAD_PROVIDER_ID,
      xRoadClientId: process.env.XROAD_CLIENT_ID,
      xRoadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
    },
    userProfile: {
      serviceBasePath: 'http://localhost:3366',
    },
    nationalRegistry: {
      baseSoapUrl: 'https://localhost:8443',
      user: process.env.SOFFIA_USER ?? '',
      password: process.env.SOFFIA_PASS ?? '',
      host: 'soffiaprufa.skra.is',
    },
    islykill: {
      cert: process.env.ISLYKILL_CERT,
      passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE,
      basePath: process.env.ISLYKILL_SERVICE_BASEPATH,
    },
  },

  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

const prodConfig = {
  production: true,
  environment: process.env.ENVIRONMENT,
  name: process.env.name,
  baseApiUrl: process.env.GRAPHQL_API_URL,
  audit: {
    defaultNamespace: '@island.is/applications',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'application-system-api',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: ['@island.is', '@admin.island.is'],
    allowClientNationalId: true,
  },
  templateApi: {
    clientLocationOrigin: process.env.CLIENT_LOCATION_ORIGIN,
    emailOptions: {
      useTestAccount: false,
      useNodemailerApp: false,
      options: {
        region: process.env.EMAIL_REGION,
      },
    },
    email: {
      sender: process.env.EMAIL_FROM_NAME,
      address: process.env.EMAIL_FROM,
    },
    jwtSecret: process.env.AUTH_JWT_SECRET,
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: process.env.GRAPHQL_API_URL,
    smsOptions: {
      url: process.env.NOVA_URL,
      username: process.env.NOVA_USERNAME,
      password: process.env.NOVA_PASSWORD,
      acceptUnauthorized: process.env.NOVA_ACCEPT_UNAUTHORIZED === 'true',
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    criminalRecord: {
      clientConfig: {
        xroadClientId: process.env.XROAD_CLIENT_ID,
        xroadBaseUrl: process.env.XROAD_BASE_PATH,
        xroadPath: process.env.XROAD_CRIMINAL_RECORD_PATH,
      },
    },
    generalPetition: {
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
    },
    healthInsuranceV2: {
      xRoadBaseUrl: process.env.XROAD_BASE_PATH,
      xRoadProviderId: process.env.XROAD_HEALTH_INSURANCE_ID,
      xRoadClientId: process.env.XROAD_CLIENT_ID,
      username: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_USERNAME,
      password: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_PASSWORD,
    },
    dataProtectionComplaint: {
      password: process.env.DATA_PROTECTION_COMPLAINT_API_PASSWORD,
      username: process.env.DATA_PROTECTION_COMPLAINT_API_USERNAME,
      XRoadProviderId: process.env.DATA_PROTECTION_COMPLAINT_XROAD_PROVIDER_ID,
      xRoadClientId: process.env.XROAD_CLIENT_ID,
      xRoadBaseUrl: process.env.XROAD_BASE_PATH,
    },
    userProfile: {
      serviceBasePath: process.env.SERVICE_USER_PROFILE_URL,
    },
    nationalRegistry: {
      baseSoapUrl: process.env.SOFFIA_SOAP_URL,
      user: process.env.SOFFIA_USER,
      password: process.env.SOFFIA_PASS,
      host: process.env.SOFFIA_HOST_URL,
    },
    islykill: {
      cert: process.env.ISLYKILL_CERT,
      passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE,
      basePath: process.env.ISLYKILL_SERVICE_BASEPATH,
    },
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

export default process.env.PROD_MODE === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
