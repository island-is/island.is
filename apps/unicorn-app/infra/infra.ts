import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
const serviceName = 'unicorn-app'
export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount(serviceName)
    .ingress({
      primary: {
        host: {
          dev: serviceName,
          staging: serviceName,
          prod: serviceName,
        },
        paths: ['/'],
      },
    })
    .replicaCount({
      default: 1,
      min: 1,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '50m',
        memory: '128Mi',
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
