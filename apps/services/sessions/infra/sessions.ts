import { PersistentVolumeClaim } from '../../../../infra/src/dsl/types/input-types'
import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-sessions'
const imageName = 'services-sessions'
const dbName = 'services_sessions'
const geoDataDir = '/geoip-lite/data'
const geoTmpDir = `${geoDataDir}/tmp`

const geoipVolume: PersistentVolumeClaim[] = [
  {
    name: 'sessions-geoip-db',
    mountPath: geoDataDir,
    size: '1Gi',
    accessModes: 'ReadWrite',
  },
]

const servicePostgresInfo = {
  // The service has only read permissions
  username: 'services_sessions_read',
  name: dbName,
  passwordSecret: '/k8s/services-sessions/readonly/DB_PASSWORD',
}

const workerPostgresInfo = {
  // Worker has write permissions
  username: 'services_sessions',
  name: dbName,
  passwordSecret: '/k8s/services-sessions/DB_PASSWORD',
  extensions: ['uuid-ossp'],
}

export const serviceSetup = (): ServiceBuilder<'services-sessions'> =>
  service('services-sessions')
    .namespace(namespace)
    .image(imageName)
    .redis()
    .postgres(servicePostgresInfo)
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      REDIS_USE_SSL: 'true',
      GEODATADIR: geoDataDir,
    })
    .secrets({
      GEOIP_LICENSE_KEY: '/k8s/services-sessions/GEOIP_LICENSE_KEY',
    })
    .volumes({
      ...geoipSetup().serviceDef.volumes[0],
      useExisting: true,
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .replicaCount({
      default: 1,
      min: 1,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '250m',
        memory: '512Mi',
      },
      requests: {
        cpu: '25m',
        memory: '300Mi',
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
    .grantNamespaces('nginx-ingress-internal', 'islandis', 'identity-server')

export const workerSetup = (): ServiceBuilder<'services-sessions-worker'> =>
  service('services-sessions-worker')
    .image(imageName)
    .namespace(namespace)
    .redis()
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
      REDIS_USE_SSL: 'true',
    })

export const geoipSetup =
  (): ServiceBuilder<'services-sessions-geoip-worker'> =>
    service('services-sessions-geoip-worker')
      .image(imageName)
      .namespace(namespace)
      .redis()
      .serviceAccount('sessions-geoip')
      .command('node')
      .replicaCount({ min: 1, max: 1, default: 1 })
      .args(
        './node_modules/geoip-lite/scripts/updatedb.js',
        'license_key=$(GEOIP_LICENSE_KEY)',
      )
      .resources({
        limits: {
          cpu: '4',
          memory: '4Gi',
        },
        requests: {
          cpu: '4',
          memory: '4Gi',
        },
      })
      .env({ GEODATADIR: geoDataDir, GEOTMPDIR: geoTmpDir })
      .secrets({
        GEOIP_LICENSE_KEY: '/k8s/services-sessions/GEOIP_LICENSE_KEY',
      })
      .volumes(...geoipVolume)
      .extraAttributes({
        dev: { schedule: '0 0 * * *' },
        staging: { schedule: '0 0 * * *' },
        prod: { schedule: '0 0 * * *' },
      })
