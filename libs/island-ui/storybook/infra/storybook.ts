import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup =
  (services: {}): ServiceBuilder<'island-ui-storybook'> =>
    service('island-ui-storybook')
      .namespace('storybook')
      .liveness('/liveness')
      .readiness('/readiness')
      .resources({
        limits: {
          cpu: '200m',
          memory: '256Mi',
        },
        requests: {
          cpu: '10m',
          memory: '128Mi',
        },
      })
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
            dev: 'ui',
            staging: 'ui',
            prod: 'ui.devland.is',
          },
          paths: ['/'],
        },
      })
      .grantNamespaces('nginx-ingress-external')
