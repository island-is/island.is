import { Environment } from './environment.interface'

const devConfig = {
  production: false,
  environment: 'local',
  name: 'local',
  baseApiUrl: 'http://localhost:4444',
  redis: {
    urls: [
      'localhost:7000',
      'localhost:7001',
      'localhost:7002',
      'localhost:7003',
      'localhost:7004',
      'localhost:7005',
    ],
  },
  audit: {
    defaultNamespace: '@island.is/applications',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  templateApi: {
    clientLocationOrigin: 'http://localhost:4242/umsoknir',
    emailOptions: {
      useTestAccount: true,
      useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
    },
    email: {
      sender: 'Devland.is',
      address: 'development@island.is',
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: 'http://localhost:4444',
    syslumenn: {
      url: 'https://api.syslumenn.is/dev',
      username: process.env.SYSLUMENN_USERNAME,
      password: process.env.SYSLUMENN_PASSWORD,
    },
    smsOptions: {
      url: 'https://smsapi.devnova.is',
      username: 'IslandIs_User_Development',
      password: process.env.NOVA_PASSWORD,
    },
    drivingLicense: {
      secret: process.env.DRIVING_LICENSE_SECRET,
      xroadClientId: 'IS-DEV/GOV/10000/island-is-client',
      xroadPath:
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
      xroadBaseUrl: 'http://localhost:8081',
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    paymentOptions: {
      arkBaseUrl: process.env.ARK_BASE_URL,
      xRoadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
      xRoadClientId:
        process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
      xRoadProviderId:
        process.env.PAYMENT_XROAD_PROVIDER_ID ?? 'IS-DEV/GOV/10021/FJS-Public',
      callbackAdditionUrl: process.env.PAYMENT_ADDITION_CALLBACK_URL ?? '/',
      callbackBaseUrl:
        process.env.PAYMENT_BASE_CALLBACK_URL ??
        'https://localhost:3333/applications/',
      username: process.env.PAYMENT_USER,
      password: process.env.PAYMENT_PASSWORD,
    },
    partyLetter: {
      partyLetterRegistryApiBasePath: 'http://localhost:4251',
      endorsementsApiBasePath: 'http://localhost:4246',
    },
    partyApplication: {
      endorsementsApiBasePath: 'http://localhost:4246',
      options: {
        adminEmails: {
          partyApplicationRvkSouth: 's@kogk.is',
          partyApplicationRvkNorth: 's@kogk.is',
          partyApplicationSouthWest: 's@kogk.is',
          partyApplicationNorthWest: 's@kogk.is',
          partyApplicationNorth: 's@kogk.is',
          partyApplicationSouth: 's@kogk.is',
        },
      },
    },
    dataProtectionComplaintApplication: {
      clientConfig: {
        password: process.env.COMPLAINT_API_CLIENT_PASSWORD,
        username: process.env.COMPLAINT_API_CLIENT_USERNAME,
      },
    },
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  signingOptions: {
    url: 'https://developers.dokobit.com',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
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
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  audit: {
    defaultNamespace: '@island.is/applications',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'application-system-api',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
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
    syslumenn: {
      url: process.env.SYSLUMENN_HOST,
      username: process.env.SYSLUMENN_USERNAME,
      password: process.env.SYSLUMENN_PASSWORD,
    },
    smsOptions: {
      url: process.env.NOVA_URL,
      username: process.env.NOVA_USERNAME,
      password: process.env.NOVA_PASSWORD,
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    drivingLicense: {
      secret: process.env.DRIVING_LICENSE_SECRET,
      xroadClientId: process.env.XROAD_CLIENT_ID,
      xroadBaseUrl: process.env.XROAD_BASE_PATH,
      xroadPath: process.env.DRIVING_LICENSE_XROAD_PATH,
    },
    paymentOptions: {
      arkBaseUrl: process.env.ARK_BASE_URL,
      xRoadBaseUrl: process.env.XROAD_BASE_PATH,
      xRoadClientId: process.env.XROAD_CLIENT_ID,
      xRoadProviderId: process.env.PAYMENT_XROAD_PROVIDER_ID,
      callbackAdditionUrl: process.env.PAYMENT_ADDITION_CALLBACK_URL,
      callbackBaseUrl: process.env.PAYMENT_BASE_CALLBACK_URL,
      username: process.env.PAYMENT_USER,
      password: process.env.PAYMENT_PASSWORD,
    },
    partyLetter: {
      partyLetterRegistryApiBasePath:
        process.env.PARTY_LETTER_REGISTRY_API_BASE_PATH,
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
    },
    partyApplication: {
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
      options: {
        adminEmails: {
          partyApplicationRvkSouth:
            process.env.PARTY_APPLICATION_RVK_SOUTH_ADMIN_EMAIL,
          partyApplicationRvkNorth:
            process.env.PARTY_APPLICATION_RVK_NORTH_ADMIN_EMAIL,
          partyApplicationSouthWest:
            process.env.PARTY_APPLICATION_SOUTH_WEST_ADMIN_EMAIL,
          partyApplicationNorthWest:
            process.env.PARTY_APPLICATION_NORTH_WEST_ADMIN_EMAIL,
          partyApplicationNorth:
            process.env.PARTY_APPLICATION_NORTH_ADMIN_EMAIL,
          partyApplicationSouth:
            process.env.PARTY_APPLICATION_SOUTH_ADMIN_EMAIL,
        },
      },
    },
    dataProtectionComplaintApplication: {
      clientConfig: {
        password: process.env.COMPLAINT_API_CLIENT_PASSWORD,
        username: process.env.COMPLAINT_API_CLIENT_USERNAME,
      },
    },
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  signingOptions: {
    url: process.env.DOKOBIT_URL,
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
