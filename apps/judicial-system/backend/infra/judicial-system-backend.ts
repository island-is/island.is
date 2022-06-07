import { Base, JudicialSystem } from '../../../../infra/src/dsl/xroad'
import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { MissingSetting } from '../../../../infra/src/dsl/types/input-types'

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
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      COMPLETED_CASE_OVERVIEW_URL: {
        dev: 'https://judicial-system.dev01.devland.is/krafa/yfirlit/',
        staging: 'https://judicial-system.staging01.devland.is/krafa/yfirlit/',
        prod: 'https://rettarvorslugatt.island.is/krafa/yfirlit/',
      },
      PROSECUTOR_RESTRICTION_CASE_OVERVIEW_URL: {
        dev: 'https://judicial-system.dev01.devland.is/krafa/stadfesta/',
        staging:
          'https://judicial-system.staging01.devland.is/krafa/stadfesta/',
        prod: 'https://rettarvorslugatt.island.is/krafa/stadfesta/',
      },
      PROSECUTOR_INVESTIGATION_CASE_OVERVIEW_URL: {
        dev:
          'https://judicial-system.dev01.devland.is/krafa/rannsoknarheimild/stadfesta/',
        staging:
          'https://judicial-system.staging01.devland.is/krafa/rannsoknarheimild/stadfesta/',
        prod:
          'https://rettarvorslugatt.island.is/krafa/rannsoknarheimild/stadfesta/',
      },
      DEFENDER_CASE_OVERVIEW_URL: {
        dev: 'https://judicial-system.dev01.devland.is/verjandi/',
        staging: 'https://judicial-system.staging01.devland.is/verjandi/',
        prod: 'https://rettarvorslugatt.island.is/verjandi/',
      },
    })
    .xroad(Base, JudicialSystem)
    .secrets({
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
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/judicial-system/CONTENTFUL_ACCESS_TOKEN',
      EVENT_URL: '/k8s/judicial-system/EVENT_URL',
      ERROR_EVENT_URL: '/k8s/judicial-system/ERROR_EVENT_URL',
      ARCHIVE_ENCRYPTION_KEY: '/k8s/judicial-system/ARCHIVE_ENCRYPTION_KEY',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .features({
      'judicial-system-sqs': {
        env: {
          SQS_QUEUE_NAME: {
            dev: 'sqs-judicial-system',
            staging: MissingSetting,
            prod: MissingSetting,
          },
          SQS_DEAD_LETTER_QUEUE_NAME: {
            dev: 'sqs-judicial-system-dlq',
            staging: MissingSetting,
            prod: MissingSetting,
          },
          SQS_REGION: {
            dev: 'eu-west-1',
            staging: MissingSetting,
            prod: MissingSetting,
          },
        },
        secrets: {},
      },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .postgres(postgresInfo)
    .resources({
      requests: { cpu: '100m', memory: '256Mi' },
      limits: { cpu: '400m', memory: '512Mi' },
    })
    .replicaCount({
      min: 4,
      max: 10,
      default: 4,
    })
