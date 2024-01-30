import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'financial-aid-backend'>
}): ServiceBuilder<'financial-aid-xrd-api'> =>
  service('financial-aid-xrd-api')
    .namespace('financial-aid')
    .serviceAccount('financial-aid-xrd-api')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      AUDIT_TRAIL_USE_GENERIC_LOGGER: 'false',
      AUDIT_TRAIL_GROUP_NAME: 'k8s/financial-aid/audit-log',
      AUDIT_TRAIL_REGION: 'eu-west-1',
    })
    .secrets({
      ERROR_EVENT_URL: '/k8s/financial-aid/ERROR_EVENT_URL',
      BACKEND_ACCESS_TOKEN: '/k8s/financial-aid/BACKEND_ACCESS_TOKEN',
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .ingress({
      primary: {
        host: {
          dev: 'financial-aid-xrd-api',
          staging: 'financial-aid-xrd-api',
          prod: 'financial-aid-xrd-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal')
