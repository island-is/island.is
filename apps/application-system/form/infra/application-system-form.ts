import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'application-system-form'> =>
  service('application-system-form')
    .namespace('application-system')
    .serviceAccount('application-system-form')
    .liveness('/liveness')
    .readiness('/readiness')
    .env({
      BASEPATH: '/umsoknir',
      SI_PUBLIC_ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      SI_PUBLIC_DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
      // Municipality code -> Veita tenant JSON. Empty map routes every municipality
      // through the original financial aid backend. Shared with the api service.
      SI_PUBLIC_FINANCIAL_AID_VEITA_TENANTS:
        '/k8s/application-system/FINANCIAL_AID_VEITA_TENANTS',
    })
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
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/umsoknir'],
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'nginx-ingress-external',
      'islandis',
    )
