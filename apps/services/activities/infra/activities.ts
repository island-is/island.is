import { json, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const serviceName = 'services-activities'

export const serviceSetup = (): ServiceBuilder<typeof serviceName> => {
  return service(serviceName)
    .namespace('activities')
    .image(serviceName)
    .postgres({
      passwordSecret: '/k8s/services/activities/DB_PASSWORD',
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      REDIS_URL_NODE_01: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
      REDIS_USE_SSL: 'true',
    })
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
        memory: '128Mi',
      },
    })
    .ingress({
      internal: {
        host: {
          dev: 'activities-api',
          staging: 'activities-api',
          prod: 'activities-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal')
}
