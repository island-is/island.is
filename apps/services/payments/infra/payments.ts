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
      XROAD_CHARGE_FJS_V2_PATH: {
        dev: 'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
        staging: 'IS-TEST/GOV/10021/FJS-Public/chargeFJS_v2',
        prod: 'IS/GOV/5402697509/FJS-Public/chargeFJS_v2',
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
