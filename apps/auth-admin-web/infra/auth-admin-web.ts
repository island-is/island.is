import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'auth-admin-web'> => {
  return service('auth-admin-web')
    .namespace('identity-server')
    .env({
      IDENTITYSERVER_ID: 'identity-server',
      IDENTITYSERVER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is'
      },
      BASE_URL: {
        dev: 'https://identity-server.dev01.devland.is/admin',
        staging: 'https://identity-server.staging01.devland.is/admin',
        prod: 'https://innskra.island.is/admin'
      },
      NEXTAUTH_URL: {
        dev: 'https://identity-server.dev01.devland.is/admin/api/auth',
        staging: 'https://identity-server.staging01.devland.is/admin/api/auth',
        prod: 'https://innskra.island.is/admin/api/auth'
    },
  })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: ['/admin'],
        public: true,
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
