import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'cms-importer-service'> =>
  service('cms-importer-service')
    .image('services-cms-importer')
    .namespace('cms-importer')
    .serviceAccount('cms-importer') //todo
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
    .ingress({
      primary: {
        host: {
          dev: 'cms-importer-service',
          staging: 'cms-importer-service',
          prod: 'cms-importer-service.devland.is',
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
