import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup =
  (): ServiceBuilder<'contentful-translation-extension'> =>
    service('contentful-translation-extension')
      .namespace('contentful-translation-extension')
      .liveness('/liveness')
      .readiness('/readiness')
      .ingress({
        primary: {
          extraAnnotations: {
            dev: {
              'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            },
            staging: {
              'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            },
            prod: {},
          },
          host: {
            dev: 'contentful-translation-extension',
            staging: 'contentful-translation-extension',
            prod: 'contentful-translation-extension.devland.is',
          },
          paths: ['/'],
        },
      })
      .grantNamespaces('nginx-ingress-external')
