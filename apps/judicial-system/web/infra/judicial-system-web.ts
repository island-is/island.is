import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'judicial-system-api'>
}): ServiceBuilder<'judicial-system-web'> =>
  service('judicial-system-web')
    .namespace('judicial-system')
    .env({
      API_URL: {
        dev: 'https://judicial-system.dev01.devland.is',
        staging: 'https://judicial-system.staging01.devland.is',
        prod: 'https://rettarvorslugatt.island.is',
      },
      INTERNAL_API_URL: ref((h) => `http://${h.svc(services.api)}`),
    })
    .secrets({
      NATIONAL_REGISTRY_API_KEY:
        '/k8s/judicial-system/NATIONAL_REGISTRY_API_KEY',
      LAWYERS_ICELAND_API_KEY: '/k8s/judicial-system/LAWYERS_ICELAND_API_KEY',
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .ingress({
      primary: {
        host: {
          dev: 'judicial-system',
          staging: 'judicial-system',
          prod: 'rettarvorslugatt.island.is',
        },
        paths: [
          {
            path: '/',
          },
        ],
      },
    })
