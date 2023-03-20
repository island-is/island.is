import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'contentful-apps'> =>
  service('contentful-apps')
    .image('contentful-apps')
    .namespace('contentful-apps')
    .serviceAccount('contentful-apps')
    .ingress({
      primary: {
        host: {
          dev: 'contentful-apps.dev01.devland.is',
          staging: 'contentful-apps.staging01.devland.is',
          prod: 'contentful-apps.island.is',
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: { 'nginx.ingress.kubernetes.io/enable-global-auth': 'false' },
        },
        paths: ['/'],
        public: true,
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .resources({
      requests: {
        cpu: '50m',
        memory: '512Mi',
      },
      limits: {
        cpu: '200m',
        memory: '1024Mi',
      },
    })
    .replicaCount({
      default: 1,
      max: 1,
      min: 1,
    })
    .extraAttributes({
      dev: { progressDeadlineSeconds: 25 * 60 },
      staging: { progressDeadlineSeconds: 25 * 60 },
      prod: { progressDeadlineSeconds: 25 * 60 },
    })
