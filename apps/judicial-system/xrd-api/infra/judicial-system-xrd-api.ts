import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-xrd-api'> =>
  service('judicial-system-xrd-api')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-xrd-api')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      AUDIT_TRAIL_USE_GENERIC_LOGGER: 'false',
      AUDIT_TRAIL_GROUP_NAME: 'k8s/judicial-system/audit-log',
      AUDIT_TRAIL_REGION: 'eu-west-1',
    })
    .secrets({
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .ingress({
      primary: {
        host: {
          dev: 'judicial-system-xrd-api',
          staging: 'judicial-system-xrd-api',
          prod: 'judicial-system-xrd-api',
        },
        paths: [
          {
            path: '/',
          },
        ],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal')
