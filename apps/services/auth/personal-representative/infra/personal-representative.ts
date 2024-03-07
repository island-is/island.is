import { json, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { MissingSetting } from '../../../../../infra/src/dsl/types/input-types'
import { Base, Client, RskProcuring } from '../../../../../infra/src/dsl/xroad'

export const serviceSetup =
  (): ServiceBuilder<'services-auth-personal-representative'> => {
    return service('services-auth-personal-representative')
      .namespace('personal-representative')
      .image('services-auth-personal-representative')
      .db({ name: 'servicesauth' })
      .env({
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
        XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN: 'true',
        XROAD_RSK_PROCURING_ACTOR_TOKEN: 'true',
        XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
          dev: 'IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1',
          staging: 'IS-TEST/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
          prod: 'IS/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
        },
        XROAD_NATIONAL_REGISTRY_REDIS_NODES: {
          dev: json([
            'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
          ]),
          staging: json([
            'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
          ]),
          prod: json([
            'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379',
          ]),
        },
        XROAD_RSK_PROCURING_REDIS_NODES: {
          dev: json([
            'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
          ]),
          staging: json([
            'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
          ]),
          prod: json([
            'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379',
          ]),
        },
      })
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET:
          '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      })
      .xroad(Base, Client, RskProcuring)
      .ingress({
        primary: {
          host: {
            dev: 'personal-representative-xrd.internal.dev01.devland.is',
            staging:
              'personal-representative-xrd.internal.staging01.devland.is',
            prod: 'personal-representative-xrd.internal.innskra.island.is',
          },
          paths: ['/'],
          public: false,
        },
        demo: {
          host: {
            dev: 'personal-representative-xrd.dev01.devland.is',
            staging: MissingSetting,
            prod: MissingSetting,
          },
          paths: ['/'],
          public: true,
        },
      })
      .readiness('/health/check')
      .liveness('/liveness')
      .resources({
        limits: {
          cpu: '400m',
          memory: '256Mi',
        },
        requests: {
          cpu: '100m',
          memory: '192Mi',
        },
      })
      .replicaCount({
        default: 2,
        min: 2,
        max: 10,
      })
  }
