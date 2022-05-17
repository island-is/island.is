import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'auth-admin-web'> => {
  return service('auth-admin-web')
    .namespace('identity-server-admin')
    .image('auth-admin-web')
    .env({
      IDENTITYSERVER_SCOPE:
        'openid profile auth-admin-api.full_control offline_access',
      IDENTITYSERVER_CLIENT_ID: 'ids-admin',
      NEXT_PUBLIC_BACKEND_URL: '/backend',
      NEXT_PUBLIC_SESSION_KEEP_ALIVE_SECONDS: '300',
      IDENTITYSERVER_ID: 'identity-server',
      IDENTITYSERVER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is',
      },
      BASE_URL: {
        dev: 'https://identity-server.dev01.devland.is/admin',
        staging: 'https://identity-server.staging01.devland.is/admin',
        prod: 'https://innskra.island.is/admin',
      },
      NEXTAUTH_URL: {
        dev: 'https://identity-server.dev01.devland.is/admin/api/auth',
        staging: 'https://identity-server.staging01.devland.is/admin/api/auth',
        prod: 'https://innskra.island.is/admin/api/auth',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server',
          staging: 'identity-server',
          prod: 'innskra.island.is',
        },
        paths: [
          {
            path: '/admin',
          },
        ],
        public: true,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
    })
    .targetPort(4200)
    .readiness('/liveness')
    .liveness('/liveness')
}
