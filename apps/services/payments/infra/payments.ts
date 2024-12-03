import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-payments'
const serviceName = namespace
const imageName = namespace

export const serviceSetup = (): ServiceBuilder<'services-payments'> =>
  service(serviceName)
    .namespace(namespace)
    .image(imageName)
    .db({
      extensions: ['uuid-ossp'],
    })
    .migrations()
    .env({
      // TODO
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
