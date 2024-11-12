import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

const namespace = 'payments'
const serviceName = `${namespace}-web`
const image = `${namespace}-image`

const basepath = '/greida'

export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .namespace(namespace)
    .image(image)
    .env({
      BASEPATH: basepath,
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
        paths: [basepath],
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces(
      'nginx-ingress-internal',
      'nginx-ingress-external',
      'islandis',
    )
