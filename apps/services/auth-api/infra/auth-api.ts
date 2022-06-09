import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistry,
  RskCompanyInfo,
  RskProcuring,
} from '../../../../infra/src/dsl/xroad'

const postgresInfo = {
  username: 'servicesauth',
  name: 'servicesauth',
  passwordSecret: '/k8s/services-auth/api/DB_PASSWORD',
}
export const serviceSetup = (): ServiceBuilder<'services-auth-api'> => {
  return service('services-auth-api')
    .namespace('identity-server')
    .image('services-auth-api')
    .postgres(postgresInfo)
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      PUBLIC_URL: {
        dev: 'https://identity-server.dev01.devland.is/api',
        staging: 'https://identity-server.staging01.devland.is/api',
        prod: 'https://innskra.island.is/api',
      },
      USER_PROFILE_CLIENT_URL: {
        dev: 'http://web-service-portal-api.service-portal.svc.cluster.local',
        staging: 'http://web-service-portal-api.service-portal.svc.cluster.local',
        prod: 'https://service-portal-api.internal.island.is',
      }
    })
    .xroad(Base, Client, RskProcuring, NationalRegistry, RskCompanyInfo)
    .readiness('/liveness')
    .liveness('/liveness')
    .initContainer({
      postgres: postgresInfo,
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
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
}
