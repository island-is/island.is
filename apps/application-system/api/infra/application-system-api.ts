import {
  json,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  PostgresInfo,
  RedisInfo,
} from '../../../../infra/src/dsl/types/input-types'
import {
  Base,
  ChargeFjsV2,
  EnergyFunds,
  Client,
  CriminalRecord,
  DataProtectionComplaint,
  DrivingLicense,
  EHIC,
  Finance,
  FishingLicense,
  HealthInsurance,
  Labor,
  MunicipalitiesFinancialAid,
  NationalRegistry,
  Passports,
  Payment,
  PaymentSchedule,
  Properties,
  RskCompanyInfo,
  TransportAuthority,
  Vehicles,
  VehicleServiceFjsV1,
  DirectorateOfImmigration,
} from '../../../../infra/src/dsl/xroad'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/application-system/api/DB_PASSWORD',
  name: 'application_system_api',
  username: 'application_system_api',
}
export const GRAPHQL_API_URL_ENV_VAR_NAME = 'GRAPHQL_API_URL' // This property is a part of a circular dependency that is treated specially in certain deployment types

const namespace = 'application-system'
const serviceAccount = 'application-system-api'
export const workerSetup =
  (): ServiceBuilder<'application-system-api-worker'> =>
    service('application-system-api-worker')
      .namespace(namespace)
      .image('application-system-api')
      .postgres(postgresInfo)
      .serviceAccount('application-system-api-worker')
      .redis()
      .env({
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/application-system',
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
        XROAD_CHARGE_FJS_V2_PATH: {
          dev: 'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
          staging: 'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
          prod: 'IS/GOV/5402697509/FJS-Public/chargeFJS_v2',
        },
        APPLICATION_ATTACHMENT_BUCKET: {
          dev: 'island-is-dev-storage-application-system',
          staging: 'island-is-staging-storage-application-system',
          prod: 'island-is-prod-storage-application-system',
        },
        FILE_SERVICE_PRESIGN_BUCKET: {
          dev: 'island-is-dev-fs-presign-bucket',
          staging: 'island-is-staging-fs-presign-bucket',
          prod: 'island-is-prod-fs-presign-bucket',
        },
        FILE_STORAGE_UPLOAD_BUCKET: {
          dev: 'island-is-dev-upload-api',
          staging: 'island-is-staging-upload-api',
          prod: 'island-is-prod-upload-api',
        },
        CLIENT_LOCATION_ORIGIN: {
          dev: 'https://beta.dev01.devland.is/umsoknir',
          staging: 'https://beta.staging01.devland.is/umsoknir',
          prod: 'https://island.is/umsoknir',
          local: 'http://localhost:4200/umsoknir',
        },
      })
      .xroad(Base, Client, Payment, EHIC)
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET:
          '/k8s/application-system/api/IDENTITY_SERVER_CLIENT_SECRET',
        SYSLUMENN_HOST: '/k8s/application-system-api/SYSLUMENN_HOST',
        SYSLUMENN_USERNAME: '/k8s/application-system/api/SYSLUMENN_USERNAME',
        SYSLUMENN_PASSWORD: '/k8s/application-system/api/SYSLUMENN_PASSWORD',
        DRIVING_LICENSE_BOOK_XROAD_PATH:
          '/k8s/application-system-api/DRIVING_LICENSE_BOOK_XROAD_PATH',
        DRIVING_LICENSE_BOOK_USERNAME:
          '/k8s/application-system-api/DRIVING_LICENSE_BOOK_USERNAME',
        DRIVING_LICENSE_BOOK_PASSWORD:
          '/k8s/application-system-api/DRIVING_LICENSE_BOOK_PASSWORD',
        DOKOBIT_ACCESS_TOKEN:
          '/k8s/application-system/api/DOKOBIT_ACCESS_TOKEN',
        DOKOBIT_URL: '/k8s/application-system-api/DOKOBIT_URL',
        ARK_BASE_URL: '/k8s/application-system-api/ARK_BASE_URL',
        DOMSYSLA_PASSWORD: '/k8s/application-system-api/DOMSYSLA_PASSWORD',
        DOMSYSLA_USERNAME: '/k8s/application-system-api/DOMSYSLA_USERNAME',
      })
      .args('main.js', '--job', 'worker')
      .command('node')
      .extraAttributes({
        dev: { schedule: '*/30 * * * *' },
        staging: { schedule: '*/30 * * * *' },
        prod: { schedule: '*/30 * * * *' },
      })

export const serviceSetup = (services: {
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
}): ServiceBuilder<'application-system-api'> =>
  service('application-system-api')
    .namespace(namespace)
    .serviceAccount(serviceAccount)
    .command('node')
    .redis()
    .args('main.js')
    .env({
      EMAIL_REGION: 'eu-west-1',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      XROAD_CHARGE_FJS_V2_TIMEOUT: '20000',
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      CLIENT_LOCATION_ORIGIN: {
        dev: 'https://beta.dev01.devland.is/umsoknir',
        staging: 'https://beta.staging01.devland.is/umsoknir',
        prod: 'https://island.is/umsoknir',
        local: 'http://localhost:4200/umsoknir',
      },
      APPLICATION_ATTACHMENT_BUCKET: {
        dev: 'island-is-dev-storage-application-system',
        staging: 'island-is-staging-storage-application-system',
        prod: 'island-is-prod-storage-application-system',
      },
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      FILE_SERVICE_PRESIGN_BUCKET: {
        dev: 'island-is-dev-fs-presign-bucket',
        staging: 'island-is-staging-fs-presign-bucket',
        prod: 'island-is-prod-fs-presign-bucket',
      },
      [GRAPHQL_API_URL_ENV_VAR_NAME]:
        'http://web-api.islandis.svc.cluster.local',
      INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS: {
        dev: 'gunnar.ingi@fjr.is',
        staging: 'gunnar.ingi@fjr.is',
        prod: 'island@island.is',
      },
      INSTITUTION_APPLICATION_RECIPIENT_NAME: {
        dev: 'Gunnar Ingi',
        staging: 'Gunnar Ingi',
        prod: 'Stafrænt Ísland',
      },
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/application-system',
      FUNDING_GOVERNMENT_PROJECTS_APPLICATION_RECIPIENT_EMAIL_ADDRESS: {
        dev: 'gunnar.ingi@fjr.is',
        staging: 'gunnar.ingi@fjr.is',
        prod: 'island@island.is',
      },
      FUNDING_GOVERNMENT_PROJECTS_APPLICATION_RECIPIENT_NAME: {
        dev: 'Gunnar Ingi',
        staging: 'Gunnar Ingi',
        prod: 'Stafrænt Ísland',
      },
      LOGIN_SERVICE_APPLICATION_RECIPIENT_EMAIL_ADDRESS: {
        dev: 'gunnar.ingi@fjr.is',
        staging: 'gunnar.ingi@fjr.is',
        prod: 'island@island.is',
      },
      LOGIN_SERVICE_APPLICATION_RECIPIENT_NAME: {
        dev: 'Gunnar Ingi',
        staging: 'Gunnar Ingi',
        prod: 'Stafrænt Ísland',
      },
      NOVA_USERNAME: {
        dev: 'IslandIs_User_Development',
        prod: 'IslandIs_User_Production',
        staging: 'IslandIs_User_Development',
      },
      FINANCIAL_STATEMENTS_INAO_BASE_PATH: {
        dev: 'https://dev-re.crm4.dynamics.com/api/data/v9.1',
        staging: 'https://dev-re.crm4.dynamics.com/api/data/v9.1',
        prod: 'https://star-re.crm4.dynamics.com/api/data/v9.1',
      },
      FINANCIAL_STATEMENTS_INAO_ISSUER:
        'https://login.microsoftonline.com/05a20268-aaea-4bb5-bb78-960b0462185e/v2.0',
      FINANCIAL_STATEMENTS_INAO_SCOPE: {
        dev: 'https://dev-re.crm4.dynamics.com/.default',
        staging: 'https://dev-re.crm4.dynamics.com/.default',
        prod: 'https://star-re.crm4.dynamics.com/.default',
      },
      FINANCIAL_STATEMENTS_INAO_TOKEN_ENDPOINT:
        'https://login.microsoftonline.com/05a20268-aaea-4bb5-bb78-960b0462185e/oauth2/v2.0/token',
      SERVICE_DOCUMENTS_BASEPATH: ref(
        (h) => `http://${h.svc(services.documentsService)}`,
      ),
      ENDORSEMENTS_API_BASE_PATH: ref(
        (h) => `http://${h.svc(services.servicesEndorsementApi)}`,
      ),
      XROAD_COURT_BANKRUPTCY_CERT_PATH: {
        dev: 'IS-DEV/GOV/10019/Domstolasyslan/JusticePortal-v1',
        staging: 'IS-DEV/GOV/10019/Domstolasyslan/JusticePortal-v1',
        prod: 'IS/GOV/4707171140/Domstolasyslan/JusticePortal-v1',
      },
      NOVA_ACCEPT_UNAUTHORIZED: {
        dev: 'true',
        staging: 'false',
        prod: 'false',
      },
      AUTH_PUBLIC_API_URL: {
        dev: 'https://identity-server.dev01.devland.is/api',
        staging: 'https://identity-server.staging01.devland.is/api',
        prod: 'https://innskra.island.is/api',
      },
    })
    .xroad(
      Base,
      Client,
      Labor,
      HealthInsurance,
      NationalRegistry,
      Payment,
      DrivingLicense,
      PaymentSchedule,
      CriminalRecord,
      DataProtectionComplaint,
      FishingLicense,
      MunicipalitiesFinancialAid,
      ChargeFjsV2,
      EnergyFunds,
      Finance,
      Properties,
      RskCompanyInfo,
      VehicleServiceFjsV1,
      TransportAuthority,
      Vehicles,
      Passports,
      EHIC,
      DirectorateOfImmigration,
    )
    .secrets({
      NOVA_URL: '/k8s/application-system-api/NOVA_URL',
      DOKOBIT_URL: '/k8s/application-system-api/DOKOBIT_URL',
      SYSLUMENN_HOST: '/k8s/application-system-api/SYSLUMENN_HOST',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/api/CONTENTFUL_ACCESS_TOKEN',
      AUTH_JWT_SECRET: '/k8s/application-system/api/AUTH_JWT_SECRET',
      DOKOBIT_ACCESS_TOKEN: '/k8s/application-system/api/DOKOBIT_ACCESS_TOKEN',
      EMAIL_FROM: '/k8s/application-system/api/EMAIL_FROM',
      EMAIL_FROM_NAME: '/k8s/application-system/api/EMAIL_FROM_NAME',
      EMAIL_REPLY_TO: '/k8s/application-system/api/EMAIL_REPLY_TO',
      EMAIL_REPLY_TO_NAME: '/k8s/application-system/api/EMAIL_REPLY_TO_NAME',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/application-system/api/IDENTITY_SERVER_CLIENT_SECRET',
      DOCUMENT_PROVIDER_ONBOARDING_REVIEWER:
        '/k8s/application-system/api/DOCUMENT_PROVIDER_ONBOARDING_REVIEWER',
      SYSLUMENN_USERNAME: '/k8s/application-system/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/application-system/api/SYSLUMENN_PASSWORD',
      DRIVING_LICENSE_BOOK_XROAD_PATH:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_XROAD_PATH',
      DRIVING_LICENSE_BOOK_USERNAME:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_USERNAME',
      DRIVING_LICENSE_BOOK_PASSWORD:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_PASSWORD',
      NOVA_PASSWORD: '/k8s/application-system/api/NOVA_PASSWORD',
      ARK_BASE_URL: '/k8s/application-system-api/ARK_BASE_URL',
      FINANCIAL_STATEMENTS_INAO_CLIENT_ID:
        '/k8s/api/FINANCIAL_STATEMENTS_INAO_CLIENT_ID',
      FINANCIAL_STATEMENTS_INAO_CLIENT_SECRET:
        '/k8s/api/FINANCIAL_STATEMENTS_INAO_CLIENT_SECRET',
      ISLYKILL_SERVICE_PASSPHRASE: '/k8s/api/ISLYKILL_SERVICE_PASSPHRASE',
      ISLYKILL_SERVICE_BASEPATH: '/k8s/api/ISLYKILL_SERVICE_BASEPATH',
      VMST_ID: '/k8s/application-system/VMST_ID',
      DOMSYSLA_PASSWORD: '/k8s/application-system-api/DOMSYSLA_PASSWORD',
      DOMSYSLA_USERNAME: '/k8s/application-system-api/DOMSYSLA_USERNAME',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .postgres(postgresInfo)
    .liveness('/liveness')
    .readiness('/liveness')
    .resources({
      limits: { cpu: '400m', memory: '1024Mi' },
      requests: { cpu: '75m', memory: '512Mi' },
    })
    .replicaCount({
      default: 2,
      max: 60,
      min: 2,
    })
    .files({ filename: 'islyklar.p12', env: 'ISLYKILL_CERT' })
    .ingress({
      primary: {
        host: {
          dev: ['application-payment-callback-xrd', 'application-callback-xrd'],
          staging: [
            'application-payment-callback-xrd',
            'application-callback-xrd',
          ],
          prod: [
            'application-payment-callback-xrd',
            'application-callback-xrd',
          ],
        },
        paths: ['/application-payment', '/applications'],
        public: false,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
    })
    .grantNamespaces('nginx-ingress-internal', 'islandis')
