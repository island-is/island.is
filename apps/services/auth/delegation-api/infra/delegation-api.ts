import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistry,
  RskProcuring,
} from '../../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'services-auth-delegation-api'> => {
  return service('services-auth-delegation-api')
    .namespace('identity-server-delegation')
    .image('services-auth-delegation-api')
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
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      NATIONAL_REGISTRY_IDS_CLIENT_SECRET:
        '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
    })
    .xroad(Base, Client, RskProcuring, NationalRegistry)
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
          dev: 'auth-delegation-api',
          staging: 'auth-delegation-api',
          prod: 'auth-delegation-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal', 'islandis')
}
