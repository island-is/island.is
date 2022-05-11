import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'auth-admin-api'> => {
  return service('auth-admin-api')
    .namespace('identity-server')
    .env({
      DB_REPLICAS_HOST: {
        dev:
          'dev-vidspyrna-aurora.cluster-ro-c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
        staging: '',
        prod: '',
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
    .readiness('/liveness')
    .liveness('/liveness')
}
