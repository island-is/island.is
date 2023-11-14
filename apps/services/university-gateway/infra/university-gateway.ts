import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  UniversityGatewayUniversityOfIceland,
} from '../../../../infra/src/dsl/xroad'

const namespace = 'university-gateway'
const imageName = 'services-university-gateway'

const postgresInfo = {
  username: 'university_gateway',
  name: 'university_gateway',
  passwordSecret: '/k8s/university-gateway/DB_PASSWORD',
}

export const serviceSetup =
  (): ServiceBuilder<'services-university-gateway'> => {
    return service('services-university-gateway')
      .serviceAccount('services-university-gateway')
      .namespace(namespace)
      .image(imageName)
      .command('node')
      .redis()
      .args('main.js')
      .resources({
        limits: { cpu: '200m', memory: '384Mi' },
        requests: { cpu: '50m', memory: '256Mi' },
      })
      .env({
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/university-gateway',
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
      })
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET:
          '/k8s/university-gateway/IDENTITY_SERVER_CLIENT_SECRET',
      })
      .xroad(Base, Client, UniversityGatewayUniversityOfIceland)
      .postgres(postgresInfo)
      .initContainer({
        containers: [
          {
            name: 'migrations',
            command: 'npx',
            args: ['sequelize-cli', 'db:migrate'],
          },
          {
            name: 'seed',
            command: 'npx',
            args: ['sequelize-cli', 'db:seed:all'],
          },
        ],
        postgres: postgresInfo,
      })
      .ingress({
        primary: {
          host: {
            dev: 'university-gateway',
            staging: 'university-gateway',
            prod: 'university-gateway',
          },
          paths: ['/api'],
          public: false,
        },
      })
      .replicaCount({
        default: 2,
        min: 2,
        max: 10,
      })
      .liveness('/liveness')
      .readiness('/liveness')
      .grantNamespaces('islandis', 'nginx-ingress-internal')
  }

export const workerSetup =
  (): ServiceBuilder<'services-university-gateway-worker'> => {
    return service('services-university-gateway-worker')
      .serviceAccount('services-university-gateway-worker')
      .namespace(namespace)
      .image(imageName)
      .command('node')
      .redis()
      .args('main.js', '--job', 'worker')
      .resources({
        limits: { cpu: '200m', memory: '384Mi' },
        requests: { cpu: '50m', memory: '256Mi' },
      })
      .env({
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/university-gateway',
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
      })
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET:
          '/k8s/university-gateway/IDENTITY_SERVER_CLIENT_SECRET',
      })
      .xroad(Base, Client, UniversityGatewayUniversityOfIceland)
      .postgres(postgresInfo)
      .extraAttributes({
        // Schedule to run hourly at minute :00 (while testing)
        dev: { schedule: '0 * * * *' },
        // Schedule to run daily at two in the morning:
        staging: { schedule: '0 2 * * *' },
        prod: { schedule: '0 2 * * *' },
      })
  }
