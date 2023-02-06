import { json, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-sessions'
const serviceName = 'services-sessions'
const workerName = 'services-sessions-read'
const imageName = 'services-sessions'
const dbName = 'services_sessions'

export const serviceSetup = (): ServiceBuilder<typeof serviceName> => {
  return service(serviceName)
    .namespace(namespace)
    .image(imageName)
    .postgres({
      // The service has only read permissions
      username: serviceName,
      name: dbName,
      passwordSecret: '/k8s/services-sessions/DB_PASSWORD',
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
          dev: 'sessions-api',
          staging: 'sessions-api',
          prod: 'sessions-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal', 'identity-server')
}

export const workerSetup = (): ServiceBuilder<typeof workerName> =>
  service(workerName)
    .image(imageName)
    .namespace(namespace)
    .serviceAccount('sessions-worker')
    .command('node')
    .args('main.js', '--job=worker')
    .postgres({
      // Worker has write permissions
      username: workerName,
      name: dbName,
      passwordSecret: '/k8s/services-sessions/readonly/DB_PASSWORD',
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
    .liveness('/liveness')
    .readiness('/liveness')
