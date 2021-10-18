import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/judicial-system/DB_PASSWORD',
  username: 'judicial_system',
  name: 'judicial_system',
}
export const serviceSetup = (): ServiceBuilder<'judicial-system-backend'> =>
  service('judicial-system-backend')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-backend')
    .env({
      DOKOBIT_URL: {
        dev: 'https://developers.dokobit.com',
        staging: 'https://developers.dokobit.com',
        prod: 'https://ws.dokobit.com',
      },
      EMAIL_REGION: 'eu-west-1',
      S3_REGION: 'eu-west-1',
      S3_BUCKET: {
        dev: 'island-is-dev-upload-judicial-system',
        staging: 'island-is-staging-upload-judicial-system',
        prod: 'island-is-prod-upload-judicial-system',
      },
      S3_TIME_TO_LIVE_POST: '15',
      S3_TIME_TO_LIVE_GET: '5',
      XROAD_BASE_PATH_WITH_ENV: {
        dev: 'https://securityserver.dev01.devland.is/r1/IS-DEV',
        staging: 'https://securityserver.staging01.devland.is/r1/IS-TEST',
        prod: 'https://securityserver.island.is/r1/IS',
      },
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      XROAD_CLIENT_ID: {
        dev: 'IS-DEV/GOV/10014/Rettarvorslugatt-Client',
        staging: 'IS-TEST/GOV/5804170510/Rettarvorslugatt-Client',
        prod: 'IS/GOV/5804170510/Rettarvorslugatt-Client',
      },
      XROAD_COURT_MEMBER_CODE: {
        dev: '10019',
        staging: '4707171140',
        prod: '4707171140',
      },
      XROAD_POLICE_MEMBER_CODE: {
        dev: '10005',
        staging: '5306972079',
        prod: '5306972079',
      },
    })
    .secrets({
      XROAD_COURT_API_PATH: '/k8s/judicial-system/XROAD_COURT_API_PATH',
      XROAD_POLICE_API_PATH: '/k8s/judicial-system/XROAD_POLICE_API_PATH',
      NOVA_URL: '/k8s/judicial-system/NOVA_URL',
      NOVA_USERNAME: '/k8s/judicial-system/NOVA_USERNAME',
      NOVA_PASSWORD: '/k8s/judicial-system/NOVA_PASSWORD',
      COURTS_MOBILE_NUMBERS: '/k8s/judicial-system/COURTS_MOBILE_NUMBERS',
      DOKOBIT_ACCESS_TOKEN: '/k8s/judicial-system/DOKOBIT_ACCESS_TOKEN',
      EMAIL_FROM: '/k8s/judicial-system/EMAIL_FROM',
      EMAIL_FROM_NAME: '/k8s/judicial-system/EMAIL_FROM_NAME',
      EMAIL_REPLY_TO: '/k8s/judicial-system/EMAIL_REPLY_TO',
      EMAIL_REPLY_TO_NAME: '/k8s/judicial-system/EMAIL_REPLY_TO_NAME',
      PRISON_EMAIL: '/k8s/judicial-system/PRISON_EMAIL',
      PRISON_ADMIN_EMAIL: '/k8s/judicial-system/PRISON_ADMIN_EMAIL',
      AUTH_JWT_SECRET: '/k8s/judicial-system/AUTH_JWT_SECRET',
      ADMIN_USERS: '/k8s/judicial-system/ADMIN_USERS',
      COURTS_CREDENTIALS: '/k8s/judicial-system/COURTS_CREDENTIALS',
      XROAD_CLIENT_CERT: '/k8s/judicial-system/XROAD_CLIENT_CERT',
      XROAD_CLIENT_KEY: '/k8s/judicial-system/XROAD_CLIENT_KEY',
      XROAD_CLIENT_PEM: '/k8s/judicial-system/XROAD_CLIENT_PEM',
      SECRET_TOKEN: '/k8s/judicial-system/SECRET_TOKEN',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/judicial-system/CONTENTFUL_ACCESS_TOKEN',
      EVENT_URL: '/k8s/judicial-system/EVENT_URL',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .postgres(postgresInfo)
    .resources({
      requests: { cpu: '100m', memory: '256Mi' },
      limits: { cpu: '400m', memory: '512Mii' },
    })
    .replicaCount({
      min: 4,
      max: 10,
      default: 4,
    })
