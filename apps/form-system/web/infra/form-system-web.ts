import {
  CodeOwners,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

const serviceName = 'form-system-web'
export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .codeOwner(CodeOwners.Advania)
    .namespace(serviceName)
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 2,
      max: 4,
      min: 2,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '25m', memory: '256Mi' },
    })
    .env({
      BASEPATH: '/form',
      SI_PUBLIC_ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      SI_PUBLIC_CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
      SI_PUBLIC_DD_RUM_APPLICATION_ID: '/k8s/DD_RUM_APPLICATION_ID',
      SI_PUBLIC_DD_RUM_CLIENT_TOKEN: '/k8s/DD_RUM_CLIENT_TOKEN',
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
        paths: ['/form'],
      },
    })
    .grantNamespaces('nginx-ingress-external')
