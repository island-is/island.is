import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { json } from '../../../../infra/src/dsl/dsl'

import { Base, Client, RskProcuring } from '../../../../infra/src/dsl/xroad'

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
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
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
        staging:
          'http://web-service-portal-api.service-portal.svc.cluster.local',
        prod: 'https://service-portal-api.internal.island.is',
      },
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
      COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
      },
      COMPANY_REGISTRY_REDIS_NODES: {
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
    .xroad(Base, Client, RskProcuring)
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
