import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup =
  (): ServiceBuilder<'icelandic-names-registry-backend'> =>
    service('icelandic-names-registry-backend')
      .image('icelandic-names-registry-backend')
      .namespace('icelandic-names-registry')
      .db()
      .migrations()
      .seed()
      .env({
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
        AUDIT_DEFAULT_NAMESPACE: '@island.is/icelandic-names-registry',
        AUDIT_SERVICE_NAME: 'icelandic-names-registry-backend',
      })
      .grantNamespaces('islandis')
      .liveness('/liveness')
      .readiness('/liveness')
