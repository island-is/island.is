import { json, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { Base, Client, RskProcuring } from '../../../../infra/src/dsl/xroad'

const createRedisUrl = (clusterId: string) =>
  `clustercfg.general-redis-cluster-group.${clusterId}.euw1.cache.amazonaws.com:6379`

const BFF_REDIS_NODES = {
  dev: createRedisUrl('5fzau3'),
  staging: createRedisUrl('ab9ckb'),
  prod: createRedisUrl('dnugi2'),
}

export const serviceSetup = (): ServiceBuilder<'services-bff'> =>
  service('services-bff')
    .namespace('services-bff')
    .image('services-bff')
    .env({
      PORT: '4444',
      IDENTITY_SERVER_CLIENT_ID: '@admin.island.is/web',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      BFF_REDIS_NODES,
      IDENTITY_SERVER_CLIENT_SCOPES: json([
        '@admin.island.is/delegation-system',
      ]),
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      NATIONAL_REGISTRY_IDS_CLIENT_SECRET:
        '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
    })
    .xroad(Base, Client, RskProcuring)
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
