import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { UniversityGatewayUniversityOfIceland } from '../../../../../infra/src/dsl/xroad'

export const serviceSetup =
  (): ServiceBuilder<'services-university-gateway-backend'> => {
    return service('services-university-gateway-backend')
      .namespace('university-gateway')
      .image('services-university-gateway-backend')
      .resources({
        limits: { cpu: '200m', memory: '384Mi' },
        requests: { cpu: '50m', memory: '256Mi' },
      })
      .env({
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
      })
      .secrets({
        AUTH_JWT_SECRET: '/k8s/university-gateway/AUTH_JWT_SECRET',
        BACKEND_ACCESS_TOKEN: '/k8s/university-gateway/BACKEND_ACCESS_TOKEN',
      })
      .xroad(UniversityGatewayUniversityOfIceland)
      .postgres({
        username: 'university_gateway',
        name: 'university_gateway',
        passwordSecret: '/k8s/university-gateway/DB_PASSWORD',
      })
      .ingress({
        primary: {
          host: {
            dev: 'university-gateway',
            staging: 'university-gateway',
            prod: 'university-gateway',
          },
          paths: ['/api/swagger'],
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
  }
