import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'redirecter'> =>
  service('redirecter')
    .namespace('islandis')
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 1,
      max: 5,
      min: 1,
    })
    .resources({
      limits: { cpu: '300m', memory: '256Mi' },
      requests: { cpu: '5m', memory: '32Mi' },
    })
    .env({})
    .secrets({})
    .ingress({
      primary: {
        host: {
          dev: ['redirect'],
          staging: ['redirect'],
          prod: ['r.island.is', 'redirect.island.is'],
        },
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
        paths: ['/'],
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'nginx-ingress-external',
      'islandis',
      'identity-server',
    )
