import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistry,
  RskProcuring,
} from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'services-auth-public-api'> => {
  return service('services-auth-public-api')
    .namespace('identity-server-admin')
    .image('services-auth-public-api')
    .postgres({
      username: 'servicesauth',
      name: 'servicesauth',
      passwordSecret: '/k8s/services-auth/api/DB_PASSWORD',
    })
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
      XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN: 'true',
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
      PUBLIC_URL: {
        dev: 'https://identity-server.dev01.devland.is/api',
        staging: 'https://identity-server.staging01.devland.is/api',
        prod: 'https://innskra.island.is/api',
      },
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      NATIONAL_REGISTRY_IDS_CLIENT_SECRET:
        '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
    })
    .xroad(Base, Client, RskProcuring, NationalRegistry)
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: [
          {
            path: '/api(/|$)(.*)',
            pathType: 'Prefix',
          },
        ],
        public: true,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
