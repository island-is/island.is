import { json, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-bff-admin-portal'> =>
  service('services-bff-admin-portal')
    .namespace('services-bff')
    .image('services-bff')
    .redis()
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@admin.island.is/bff',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      BFF_CALLBACKS_BASE_PATH: {
        dev: 'https://beta.dev01.devland.is/stjornbord/bff/callbacks',
        staging: 'https://beta.staging01.devland.is/stjornbord/bff/callbacks',
        prod: 'https://island.is/stjornbord/bff/callbacks',
      },
      IDENTITY_SERVER_CLIENT_SCOPES: json([
        '@admin.island.is/delegation-system',
        '@admin.island.is/ads',
        '@admin.island.is/bff',
        '@admin.island.is/ads:explicit',
        '@admin.island.is/delegations',
        '@admin.island.is/regulations',
        '@admin.island.is/regulations:manage',
        '@admin.island.is/icelandic-names-registry',
        '@admin.island.is/document-provider',
        '@admin.island.is/application-system:admin',
        '@admin.island.is/application-system:institution',
        '@admin.island.is/auth',
        '@admin.island.is/auth:admin',
        '@admin.island.is/petitions',
        '@admin.island.is/service-desk',
        '@admin.island.is/signature-collection:process',
        '@admin.island.is/signature-collection:manage',
        '@admin.island.is/form-system',
        '@admin.island.is/form-system:admin',
      ]),
      BFF_API_URL_PREFIX: 'stjornbord/bff',
    })
    .secrets({
      BFF_IDENTITY_SERVER_SECRET:
        '/k8s/services-bff/BFF_IDENTITY_SERVER_SECRET',
    })
    .readiness('/health/check')
    .liveness('/liveness')
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
    })
