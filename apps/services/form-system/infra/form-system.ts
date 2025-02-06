import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-form-system-api'> =>
  service('services-form-system-api')
    .image('services-form-system-api')
    .namespace('services-form-system-api')
    .codeOwner(CodeOwners.Advania)
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
