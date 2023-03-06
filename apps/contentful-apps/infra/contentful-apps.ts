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
          prod: 'contentful-apps.devland.is',
        },
        paths: ['/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: { 'nginx.ingress.kubernetes.io/enable-global-auth': 'false' },
        },
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
