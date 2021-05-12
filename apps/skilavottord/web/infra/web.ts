import { ref, service, ServiceBuilder } from '../../../../libs/helm/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'skilavottord-ws'>
}): ServiceBuilder<'skilavottord-web'> =>
  service('skilavottord-web')
    .namespace('skilavottord')
    .liveness('/liveness')
    .readiness('/liveness')
    .env({
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/app/skilavottord/'],
      },
    })
    .grantNamespaces('nginx-ingress-external')
