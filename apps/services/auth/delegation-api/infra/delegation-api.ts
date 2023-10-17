import { json, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistry,
  RskProcuring,
} from '../../../../../infra/src/dsl/xroad'

export const serviceSetup =
  (): ServiceBuilder<'services-auth-delegation-api'> => {
    return service('services-auth-delegation-api')
      .namespace('identity-server-delegation')
      .postgres({
        username: 'servicesauth',
        name: 'servicesauth',
        passwordSecret: '/k8s/services-auth/api/DB_PASSWORD',
      })
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
        NATIONAL_REGISTRY_IDS_CLIENT_SECRET:
          '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
      })
      .xroad(Base, Client, RskProcuring)
      .readiness('/liveness')
      .liveness('/liveness')
      .replicaCount({
        default: 2,
        min: 2,
        max: 10,
      })
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
      .ingress({
        internal: {
          host: {
            dev: 'auth-delegation-api',
            staging: 'auth-delegation-api',
            prod: 'auth-delegation-api.internal.innskra.island.is',
          },
          paths: ['/'],
          public: false,
        },
      })
      .grantNamespaces('nginx-ingress-internal', 'islandis')
  }
