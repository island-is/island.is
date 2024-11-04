import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-payments'
const imageName = namespace

export const serviceSetup = (): ServiceBuilder<typeof namespace> =>
  service(namespace)
    .namespace(namespace)
    .image(imageName)
    .db()
    .env({
      // TODO
    })
    .ingress({
      internal: {
        host: {
          dev: 'payments-api',
          staging: 'payments-api',
          prod: 'payments-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
