import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import { Base, Client } from '../../../../infra/src/dsl/xroad'

const serviceName = 'services-form-system-api'
const workerName = `${serviceName}-worker`

export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount('form-system-api')
    .codeOwner(CodeOwners.Advania)
    .db()
    .migrations()
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      S3_REGION: 'eu-west-1',
      S3_TIME_TO_LIVE_POST: '15',
      S3_TIME_TO_LIVE_GET: '5',
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      FORM_SYSTEM_BUCKET: {
        dev: 'island-is-dev-form-system-presign-bucket',
        staging: 'island-is-staging-form-system-presign-bucket',
        prod: 'island-is-prod-form-system-presign-bucket',
      },
    })
    .secrets({
      FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX',
      FORM_SYSTEM_ZENDESK_TENANT_ID_PROD:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_TENANT_ID_PROD',
      FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX',
      FORM_SYSTEM_ZENDESK_API_KEY_PROD:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_API_KEY_PROD',
      SYSLUMENN_HOST: '/k8s/form-system/SYSLUMENN_HOST',
      SYSLUMENN_USERNAME: '/k8s/form-system/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/form-system/SYSLUMENN_PASSWORD',
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .xroad(Base, Client)
    .ingress({
      primary: {
        host: {
          dev: serviceName,
          staging: serviceName,
          prod: serviceName,
        },
        paths: ['/api'],
        public: false,
      },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('islandis', 'nginx-ingress-external')

export const workerSetup = (): ServiceBuilder<typeof workerName> =>
  service(workerName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount(workerName)
    .codeOwner(CodeOwners.Advania)
    .redis()
    .db()
    .env({
      S3_REGION: 'eu-west-1',
      S3_TIME_TO_LIVE_POST: '15',
      S3_TIME_TO_LIVE_GET: '5',
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      FORM_SYSTEM_BUCKET: {
        dev: 'island-is-dev-form-system-presign-bucket',
        staging: 'island-is-staging-form-system-presign-bucket',
        prod: 'island-is-prod-form-system-presign-bucket',
      },
    })
    .args('main.cjs', '--job', 'worker')
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
