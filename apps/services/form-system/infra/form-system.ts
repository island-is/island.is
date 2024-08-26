import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-form-system'> =>
  service('services-form-system')
    .image('services-form-system')
    .namespace('services-form-system')
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .db()
    .migrations()
    .seed()
    .grantNamespaces('islandis')
