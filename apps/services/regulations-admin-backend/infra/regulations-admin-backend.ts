import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistryB2C,
} from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'regulations-admin-backend'> =>
  service('regulations-admin-backend')
    .image('regulations-admin-backend')
    .namespace('regulations-admin')
    .serviceAccount('regulations-admin-backend')
    .codeOwner(CodeOwners.Hugsmidjan)
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/regulations-admin-api',
    })
    .db()
    .migrations()
    .secrets({
      REGULATIONS_API_URL: '/k8s/api/REGULATIONS_API_URL',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-regulations-admin/IDENTITY_SERVER_CLIENT_SECRET',
      REGULATIONS_FILE_UPLOAD_KEY_DRAFT:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_DRAFT',
      REGULATIONS_FILE_UPLOAD_KEY_PUBLISH:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_PUBLISH',
      REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '100m', memory: '256Mi' },
    })
    .xroad(Base, Client, NationalRegistryB2C)
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('islandis', 'download-service')
