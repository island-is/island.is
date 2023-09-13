import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'university-gateway-backend'> =>
  service('university-gateway-backend')
    .namespace('university-gateway-backend')
    .secrets({
      //TODOx vantar að búa til í AWS
      AUTH_JWT_SECRET: '/k8s/university-gateway/AUTH_JWT_SECRET',
      BACKEND_ACCESS_TOKEN: '/k8s/university-gateway/BACKEND_ACCESS_TOKEN',
    })
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
