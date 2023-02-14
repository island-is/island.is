import { json, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-sessions'
const imageName = 'services-sessions'
const dbName = 'services_sessions'

const workerPostgresInfo = {
  // Worker has write permissions
  username: 'services_sessions',
  name: dbName,
  passwordSecret: '/k8s/services-sessions/DB_PASSWORD',
}

export const workerSetup = (): ServiceBuilder<'services-sessions-worker'> =>
  service('services-sessions-worker')
    .image(imageName)
    .namespace(namespace)
    .serviceAccount('sessions-worker')
    .command('node')
    .args('main.js', '--job=worker')
    .postgres(workerPostgresInfo)
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: workerPostgresInfo,
      envs: {
        NO_UPDATE_NOTIFIER: 'true',
      },
    })
    .liveness('/liveness')
    .readiness('/liveness')
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
