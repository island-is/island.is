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
    .codeOwner(CodeOwners.Advania)
    .db()
    .migrations()
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
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
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/form-api'],
        public: true,
      },
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('islandis', 'nginx-ingress-external')
