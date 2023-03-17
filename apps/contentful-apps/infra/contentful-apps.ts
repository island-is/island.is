import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'contentful-apps'> =>
  service('contentful-apps')
    .image('contentful-apps')
    .namespace('contentful-apps')
    .serviceAccount('contentful-apps')
    .ingress({
      primary: {
        host: {
          dev: 'contentful-apps',
          staging: 'contentful-apps',
          prod: 'contentful-apps',
        },
        paths: ['/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {},
          prod: {},
        },
        public: true,
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .replicaCount({
      default: 2,
      max: 50,
      min: 2,
    })
    .grantNamespaces('nginx-ingress-external')
