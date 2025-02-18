import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

const serviceName = 'services-form-system-api'
export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(serviceName)
    .namespace(serviceName)
    .codeOwner(CodeOwners.Advania)
    .db()
    .migrations()
    .seed()
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .grantNamespaces('islandis')
