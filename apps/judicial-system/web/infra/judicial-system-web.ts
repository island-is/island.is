import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { MissingSetting } from '../../../../infra/src/dsl/types/input-types'

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
        paths: ['/'],
      },
    })
