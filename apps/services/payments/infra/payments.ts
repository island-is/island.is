import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-payments'
const serviceName = `${namespace}`
const imageName = `${namespace}-image`

export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .namespace(namespace)
    .image(imageName)
    .db()
    .migrations()
    .env({
      // TODO
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
