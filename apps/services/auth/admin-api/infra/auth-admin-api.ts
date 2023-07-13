import { json, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'

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
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL_LIST: {
        dev: json([
          'https://identity-server.dev01.devland.is',
          'https://identity-server.staging01.devland.is',
          'https://innskra.island.is',
        ]),
        staging: json([
          'https://identity-server.staging01.devland.is',
          'https://innskra.island.is',
        ]),
        prod: json(['https://innskra.island.is']),
      },
    })
    .secrets({
      CLIENT_SECRET_ENCRYPTION_KEY:
        '/k8s/services-auth/admin-api/CLIENT_SECRET_ENCRYPTION_KEY',
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
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
      },
    })
    .readiness('/backend/liveness')
    .liveness('/backend/liveness')
    .resources({
      limits: {
        cpu: '400m',
        memory: '768Mi',
      },
      requests: {
        cpu: '100m',
        memory: '512Mi',
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .grantNamespaces(
      'nginx-ingress-external',
      'nginx-ingress-internal',
      'islandis',
    )
}
