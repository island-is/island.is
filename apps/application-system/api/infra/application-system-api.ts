import {
  CodeOwners,
  Context,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  Base,
  ChargeFjsV2,
  Client,
  CriminalRecord,
  DataProtectionComplaint,
  DirectorateOfImmigration,
  DrivingLicense,
  EHIC,
  EnergyFunds,
  Finance,
  FishingLicense,
  HealthInsurance,
  Labor,
  MunicipalitiesFinancialAid,
  NationalRegistry,
  OccupationalLicenses,
  Passports,
  Payment,
  PaymentSchedule,
  Properties,
  RskCompanyInfo,
  RskCarRentalRate,
  SeminarsVer,
  SocialInsuranceAdministration,
  TransportAuthority,
  Vehicles,
  VehicleServiceFjsV1,
  WorkMachines,
  SignatureCollection,
  ArborgWorkpoint,
  Inna,
  OfficialJournalOfIceland,
  OfficialJournalOfIcelandApplication,
  LegalGazette,
  VehiclesMileage,
  UniversityCareers,
  Frigg,
  HealthDirectorateVaccination,
  HealthDirectorateHealthService,
  HealthDirectorateOrganDonation,
  WorkAccidents,
  NationalRegistryB2C,
  SecondarySchool,
  PracticalExams,
  RentalService,
  FireCompensation,
  VMSTUnemployment,
} from '../../../../infra/src/dsl/xroad'

export const GRAPHQL_API_URL_ENV_VAR_NAME = 'GRAPHQL_API_URL' // This property is a part of a circular dependency that is treated specially in certain deployment types

/**
 * Make sure that each feature deployment has its own bull prefix. Since each
 * feature deployment has its own database and applications, we don't want bull
 * jobs to jump between environments.
 */
const APPLICATION_SYSTEM_BULL_PREFIX = (ctx: Context) =>
  ctx.featureDeploymentName
    ? `application_system_api_bull_module.${ctx.featureDeploymentName}`
    : 'application_system_api_bull_module'

const namespace = 'application-system'
const serviceAccount = 'application-system-api'
export const workerSetup = (services: {
  userNotificationService: ServiceBuilder<'services-user-notification'>
  paymentsApi: ServiceBuilder<'services-payments'>
}): ServiceBuilder<'application-system-api-worker'> =>
  service('application-system-api-worker')
    .namespace(namespace)
    .image('application-system-api')
    .db()
    .serviceAccount('application-system-api-worker')
    .redis()
    .codeOwner(CodeOwners.NordaApplications)
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/application-system',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      XROAD_CHARGE_FJS_V2_PATH: {
        dev: 'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
        staging: 'IS-TEST/GOV/10021/FJS-Public/chargeFJS_v2',
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
      USER_NOTIFICATION_API_URL: ref(
        (h) => `http://${h.svc(services.userNotificationService)}`,
      ),
      APPLICATION_SYSTEM_BULL_PREFIX,
      PAYMENTS_API_URL: ref((h) => `http://${h.svc(services.paymentsApi)}`),
      PAYMENT_API_CALLBACK_URL: ref(
        (ctx) =>
          `http://${
            ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
          }application-system-api.application-system.svc.cluster.local`,
      ),
    })
    .xroad(Base, Client, Payment, Inna, EHIC, WorkMachines)
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
      DOKOBIT_ACCESS_TOKEN: '/k8s/application-system/api/DOKOBIT_ACCESS_TOKEN',
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
    .resources({
      limits: { cpu: '400m', memory: '768Mi' },
      requests: { cpu: '150m', memory: '384Mi' },
    })

export const serviceSetup = (services: {
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
  skilavottordWs: ServiceBuilder<'skilavottord-ws'>
  // The user profile service is named service-portal-api in infra setup
  servicePortalApi: ServiceBuilder<'service-portal-api'>
  userNotificationService: ServiceBuilder<'services-user-notification'>
  paymentsApi: ServiceBuilder<'services-payments'>
}): ServiceBuilder<'application-system-api'> =>
  service('application-system-api')
    .namespace(namespace)
    .serviceAccount(serviceAccount)
    .command('node')
    .redis()
    .codeOwner(CodeOwners.NordaApplications)
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
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }beta.dev01.devland.is/umsoknir`,
        ),
        staging: `https://beta.staging01.devland.is/umsoknir`,
        prod: `https://island.is/umsoknir`,
        local: 'http://localhost:4242/umsoknir',
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
      [GRAPHQL_API_URL_ENV_VAR_NAME]: 'http://api.islandis.svc.cluster.local',
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
        staging: 'IS-TEST/GOV/10019/Domstolasyslan/JusticePortal-v1',
        prod: 'IS/GOV/4707171140/Domstolasyslan/JusticePortal-v1',
      },
      XROAD_ALTHINGI_OMBUDSMAN_SERVICE_PATH: {
        dev: 'IS-DEV/GOV/10047/UA-Protected/kvortun-v1',
        staging: 'IS-TEST/GOV/10047/UA-Protected/kvortun-v1',
        prod: 'IS/GOV/5605882089/UA-Protected/kvortun-v1',
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
      RECYCLING_FUND_GQL_BASE_PATH: ref(
        (h) =>
          `http://${h.svc(
            services.skilavottordWs,
          )}/app/skilavottord/api/graphql`,
      ),
      UNIVERSITY_GATEWAY_API_URL: {
        dev: 'http://services-university-gateway.services-university-gateway.svc.cluster.local',
        staging:
          'http://services-university-gateway.services-university-gateway.svc.cluster.local',
        prod: 'http://services-university-gateway.services-university-gateway.svc.cluster.local',
      },
      SERVICE_USER_PROFILE_URL: ref(
        (h) => `http://${h.svc(services.servicePortalApi)}`,
      ),
      USER_NOTIFICATION_API_URL: ref(
        (h) => `http://${h.svc(services.userNotificationService)}`,
      ),
      APPLICATION_SYSTEM_BULL_PREFIX,
      PAYMENTS_API_URL: ref((h) => `http://${h.svc(services.paymentsApi)}`),
      PAYMENT_API_CALLBACK_URL: ref(
        (ctx) =>
          `http://application-system-api.${
            ctx.featureDeploymentName
              ? `feature-${ctx.featureDeploymentName}`
              : 'application-system'
          }.svc.cluster.local`,
      ),
    })
    .xroad(
      Base,
      Client,
      Labor,
      HealthInsurance,
      NationalRegistry,
      NationalRegistryB2C,
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
      FireCompensation,
      Properties,
      RskCompanyInfo,
      RskCarRentalRate,
      VehicleServiceFjsV1,
      Inna,
      VehiclesMileage,
      TransportAuthority,
      Vehicles,
      Passports,
      EHIC,
      DirectorateOfImmigration,
      SocialInsuranceAdministration,
      SeminarsVer,
      OccupationalLicenses,
      SignatureCollection,
      WorkMachines,
      ArborgWorkpoint,
      OfficialJournalOfIceland,
      OfficialJournalOfIcelandApplication,
      LegalGazette,
      UniversityCareers,
      Frigg,
      HealthDirectorateVaccination,
      HealthDirectorateHealthService,
      HealthDirectorateOrganDonation,
      WorkAccidents,
      SecondarySchool,
      PracticalExams,
      RentalService,
      VMSTUnemployment,
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
      ALTHINGI_OMBUDSMAN_XROAD_USERNAME:
        '/k8s/api/ALTHINGI_OMBUDSMAN_XROAD_USERNAME',
      ALTHINGI_OMBUDSMAN_XROAD_PASSWORD:
        '/k8s/api/ALTHINGI_OMBUDSMAN_XROAD_PASSWORD',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .db()
    .migrations()
    .liveness({ path: '/liveness', initialDelaySeconds: 20 })
    .readiness({ path: '/liveness', initialDelaySeconds: 20 })
    .resources({
      limits: { cpu: '600m', memory: '1024Mi' },
      requests: { cpu: '200m', memory: '512Mi' },
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
    .grantNamespaces('services-payments', 'nginx-ingress-internal', 'islandis')
