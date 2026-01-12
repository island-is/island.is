import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

const namespace = 'payments'
const serviceName = namespace
const image = namespace

const basepath = '/greida'

export const serviceSetup = (services: {
  api: ServiceBuilder<'api'>
}): ServiceBuilder<'payments'> =>
  service(serviceName)
    .image(image)
    .namespace(namespace)
    .serviceAccount('payments')
    .env({
      BASEPATH: basepath,
      API_INTERNAL_BASEPATH: ref((h) => `http://${h.svc(services.api)}`),
      API_EXTERNAL_BASEPATH: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }beta.dev01.devland.is`,
        ),
        staging: 'https://beta.staging01.devland.is',
        prod: 'https://island.is',
      },
      APP_EXTERNAL_BASEPATH: {
        local: 'http://localhost:4200',
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }beta.dev01.devland.is`,
        ),
        staging: 'https://beta.staging01.devland.is',
        prod: 'https://island.is',
      },
    })
    .secrets({
      SI_PUBLIC_CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
      SI_PUBLIC_DD_RUM_APPLICATION_ID: '/k8s/DD_RUM_APPLICATION_ID',
      SI_PUBLIC_DD_RUM_CLIENT_TOKEN: '/k8s/DD_RUM_CLIENT_TOKEN',
      PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET:
        '/k8s/payments/PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET',
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
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
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
