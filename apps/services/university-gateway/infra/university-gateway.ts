import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  UniversityGatewayUniversityOfIceland,
} from '../../../../infra/src/dsl/xroad'

const postgresInfo = {
  username: 'university_gateway',
  name: 'university_gateway',
  passwordSecret: '/k8s/university-gateway/DB_PASSWORD',
}

export const serviceSetup =
  (): ServiceBuilder<'services-university-gateway'> => {
    return service('services-university-gateway')
      .namespace('university-gateway')
      .image('services-university-gateway')
      .resources({
        limits: { cpu: '200m', memory: '384Mi' },
        requests: { cpu: '50m', memory: '256Mi' },
      })
      .env({
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/api',
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
      })
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET: '/k8s/api/IDENTITY_SERVER_CLIENT_SECRET',
      })
      .xroad(Base, Client, UniversityGatewayUniversityOfIceland)
      .postgres(postgresInfo)
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
        envs: {
          NO_UPDATE_NOTIFIER: 'true',
        },
      })
      .liveness('/liveness')
      .readiness('/liveness')
      .grantNamespaces('islandis', 'nginx-ingress-internal')
  }
