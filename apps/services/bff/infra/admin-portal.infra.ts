import { json, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { Base, Client, RskProcuring } from '../../../../infra/src/dsl/xroad'

const createRedisUrl = (clusterId: string) =>
  `clustercfg.general-redis-cluster-group.${clusterId}.euw1.cache.amazonaws.com:6379`

const BFF_REDIS_NODES = {
  dev: createRedisUrl('dummy'), // TODO - change to correct cluster id
  staging: createRedisUrl('dummy'),  // TODO - change to correct cluster id
  prod: createRedisUrl('dummy'),  // TODO - change to correct cluster id
}

export const serviceSetup = (): ServiceBuilder<'services-bff'> =>
  service('services-bff')
    .namespace('services-bff')
    .image('services-bff')
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@admin.island.is/web',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      BFF_REDIS_NODES,
      BFF_CALLBACKS_LOGIN_REDIRECT_URI: {
        dev: 'https://beta.dev01.devland.is/stjornbord/bff/callbacks/login',
        staging: 'https://beta.staging01.devland.is/stjornbord/bff/callbacks/login',
        prod: 'https://island.is/stjornbord/bff/callbacks/login',
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
        'TODO - add secret',
    })
    .xroad(Base, Client)
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
