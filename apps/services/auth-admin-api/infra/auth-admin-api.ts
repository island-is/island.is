import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-auth-admin-api'> => {
  return service('services-auth-admin-api')
    .namespace('identity-server-admin')
    .image('services-auth-admin-api')
    .postgres({
      username: 'servicesauth',
      name: 'servicesauth',
      passwordSecret: '/k8s/services-auth/api/DB_PASSWORD',
    })
    .env({
      IDS_ISSUER: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: ['/backend'],
        public: true,
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .resources({
      limits: {
        cpu: '400m',
        memory: '256Mi'
      }, 
      requests: {
        cpu: '100m',
        memory: '128Mi'
      }
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10
    })
}
