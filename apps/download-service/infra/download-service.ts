import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import { Base, Client, Finance } from '../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'download-service'> =>
  service('download-service')
    .image('download-service')
    .namespace('download-service')
    .secrets({
      POSTHOLF_CLIENTID: '/k8s/documents/POSTHOLF_CLIENTID',
      POSTHOLF_CLIENT_SECRET: '/k8s/documents/POSTHOLF_CLIENT_SECRET',
      POSTHOLF_TOKEN_URL: '/k8s/documents/POSTHOLF_TOKEN_URL',
      POSTHOLF_BASE_PATH: '/k8s/documents/POSTHOLF_BASE_PATH',
    })
    .xroad(Base, Client, Finance)
    .ingress({
      primary: {
        host: {
          dev: ['api'],
          staging: ['api'],
          prod: ['api'],
        },
        paths: ['/download'],
        extraAnnotations: {
          dev: {},
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
        public: true,
      },
    })
    .liveness('download/v1/liveness')
    .readiness('download/v1/readiness')
    .grantNamespaces('islandis', 'nginx-ingress-external')
