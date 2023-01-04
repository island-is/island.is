import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'samradsgatt'> =>
  service('samradsgatt')
    .image('samradsgatt')
    .namespace('samradsgatt')
    .liveness('/liveness')
    .readiness('/liveness')
    .replicaCount({
      default: 5,
      max: 30,
      min: 5,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .env({
      BASEPATH: '/samradsgatt',
      NEXTAUTH_URL: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }loftbru.dev01.devland.is`,
        ),
        staging: 'https://loftbru.staging01.devland.is',
        prod: 'https://loftbru.island.is',
      },
      ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      DD_RUM_APPLICATION_ID: '/k8s/DD_RUM_APPLICATION_ID',
      DD_RUM_CLIENT_TOKEN: '/k8s/DD_RUM_CLIENT_TOKEN',
    })
    .ingress({
      primary: {
        host: {
          dev: 'samradsgatt',
          staging: 'samradsgatt',
          prod: 'samradsgatt',
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
        paths: ['/samradsgatt'],
      },
    })
    .grantNamespaces('islandis', 'nginx-ingress-external')
