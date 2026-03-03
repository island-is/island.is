import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-digital-mailbox-api'> =>
  service('judicial-system-digital-mailbox-api')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-digital-mailbox-api')
    .image('judicial-system-digital-mailbox-api')
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '30m',
        memory: '256Mi',
      },
    })
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      AUDIT_TRAIL_USE_GENERIC_LOGGER: 'false',
      AUDIT_TRAIL_GROUP_NAME: 'k8s/judicial-system/audit-log',
      AUDIT_TRAIL_REGION: 'eu-west-1',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .secrets({
      ERROR_EVENT_URL: '/k8s/judicial-system/ERROR_EVENT_URL',
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
      LAWYERS_ICELAND_API_KEY: '/k8s/judicial-system/LAWYERS_ICELAND_API_KEY',
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .ingress({
      primary: {
        host: {
          dev: 'judicial-system-digital-mailbox-api-xrd',
          staging: 'judicial-system-digital-mailbox-api-xrd',
          prod: 'judicial-system-digital-mailbox-api-xrd',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal')
