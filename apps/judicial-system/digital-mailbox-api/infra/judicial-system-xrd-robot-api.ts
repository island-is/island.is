import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-digital-mailbox-api'> =>
  service('judicial-system-digital-mailbox-api')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-digital-mailbox-api')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      AUDIT_TRAIL_USE_GENERIC_LOGGER: 'false',
      AUDIT_TRAIL_GROUP_NAME: 'k8s/judicial-system/audit-log',
      AUDIT_TRAIL_REGION: 'eu-west-1',
    })
    .secrets({
      ERROR_EVENT_URL: '/k8s/judicial-system/ERROR_EVENT_URL',
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
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
