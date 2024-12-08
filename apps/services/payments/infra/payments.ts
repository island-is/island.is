import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { Base, Client, ChargeFjsV2 } from '../../../../infra/src/dsl/xroad'

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
    .xroad(Base, Client, ChargeFjsV2)
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
