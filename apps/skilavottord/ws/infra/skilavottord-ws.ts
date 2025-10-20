import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'skilavottord-ws'> =>
  service('skilavottord-ws')
    .namespace('skilavottord')
    .serviceAccount('skilavottord-ws')
    .db({ name: 'skilavottord' })
    .migrations()
    .secrets({
      SAMGONGUSTOFA_SOAP_URL: '/k8s/skilavottord-ws/SAMGONGUSTOFA_SOAP_URL',
      SAMGONGUSTOFA_REST_AUTH_URL:
        '/k8s/skilavottord-ws/SAMGONGUSTOFA_REST_AUTH_URL',
      SAMGONGUSTOFA_REST_DEREG_URL:
        '/k8s/skilavottord-ws/SAMGONGUSTOFA_REST_DEREG_URL',
      FJARSYSLA_REST_URL: '/k8s/skilavottord-ws/FJARSYSLA_REST_URL',
      SAMGONGUSTOFA_REST_PASS: '/k8s/skilavottord/SAMGONGUSTOFA_REST_PASS',
      SAMGONGUSTOFA_SOAP_PASS: '/k8s/skilavottord/SAMGONGUSTOFA_SOAP_PASS',
      FJARSYSLA_REST_PASS: '/k8s/skilavottord/FJARSYSLA_REST_PASS',
      SAMGONGUSTOFA_SOAP_USER: '/k8s/skilavottord/SAMGONGUSTOFA_SOAP_USER',
      SAMGONGUSTOFA_REST_USER: '/k8s/skilavottord/SAMGONGUSTOFA_REST_USER',
      FJARSYSLA_REST_USER: '/k8s/skilavottord/FJARSYSLA_REST_USER',
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/app/skilavottord/api/graphql'],
      },
    })
    .grantNamespaces('application-system')
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '40m',
        memory: '256Mi',
      },
    })
