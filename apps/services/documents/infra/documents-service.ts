import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-documents'> =>
  service('services-documents')
    .image('services-documents')
    .namespace('services-documents')
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      AUDIT_DEFAULT_NAMESPACE: '@island.is/documents',
      AUDIT_SERVICE_NAME: 'services-documents',
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .db()
    .migrations()
    .grantNamespaces('islandis', 'application-system')
