import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'university-gateway-backend'>
}): ServiceBuilder<'university-gateway-api'> =>
  service('university-gateway-api')
    .namespace('university-gateway')
    .resources({
      limits: { cpu: '150m', memory: '384Mi' },
      requests: { cpu: '15m', memory: '256Mi' },
    })
    .image('university-gateway')
    .secrets({})
    .postgres({
      username: 'university-gateway',
      name: 'university-gateway',
      passwordSecret: '/k8s/university-gateway/DB_PASSWORD',
    })
    .ingress({
      primary: {
        host: {
          dev: 'university-gateway',
          staging: 'university-gateway',
          prod: 'university-gateway',
        },
        paths: ['/'],
        public: true,
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('nginx-ingress-internal')
