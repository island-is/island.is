import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

const serviceName = 'services-form-system-api'
export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount(serviceName)
    .codeOwner(CodeOwners.Advania)
    .db()
    .migrations()
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      FORM_SYSTEM_BUCKET: {
        dev: 'island-is-dev-storage-form-system',
        staging: '', // Still need to get buckets created
        prod: '',
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
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('islandis', 'nginx-ingress-external')
