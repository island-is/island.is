import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-auth-admin-api'> => {
  return service('services-auth-admin-api')
    .namespace('identity-server-admin')
    .image('services-auth-admin-api')
    .env({
      DB_HOST: 'postgres-ids.internal',
      DB_USER: 'servicesauth',
      DB_NAME: 'servicesauth',
      DB_REPLICAS_HOST: {
        dev:
          'dev-vidspyrna-aurora.cluster-ro-c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
        staging: 'postgres-ids.internal',
        prod: 'postgres-ids.internal',
      },
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
        paths: [
          {
            path: '/backend',
          },
        ],
        public: true,
      },
    })
    .secrets({
      DB_PASS: '/k8s/services-auth/api/DB_PASSWORD',
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
