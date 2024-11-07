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
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('islandis')
