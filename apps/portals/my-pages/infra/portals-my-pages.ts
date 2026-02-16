// trigger deployment
import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'service-portal'> =>
  service('service-portal')
    .namespace('service-portal')
    .serviceAccount('service-portal')
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
    })
    .resources({
      limits: { cpu: '300m', memory: '256Mi' },
      requests: { cpu: '5m', memory: '32Mi' },
    })
    .env({
      BASEPATH: '/minarsidur',
      SI_PUBLIC_ENVIRONMENT: ref((h) => h.env.type),
      NEXT_PUBLIC_MATOMO_DOMAIN: {
        dev: 'https://matomo-dev.dev01.devland.is',
        staging: 'https://matomo-dev.dev01.devland.is',
        prod: 'https://matomo-dev.dev01.devland.is',
      },
      NEXT_PUBLIC_MATOMO_SITE_ID: { dev: '2', staging: '2', prod: '2' },
    })
    .secrets({
      SI_PUBLIC_CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
      SI_PUBLIC_DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
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
        paths: ['/minarsidur'],
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'nginx-ingress-external',
      'islandis',
      'user-notification',
      'identity-server',
    )
