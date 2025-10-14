import {
  CodeOwners,
  ref,
  service,
  ServiceBuilder,
} from '../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'api'>
}): ServiceBuilder<'consultation-portal'> => {
  const consultationService = service('consultation-portal')
  consultationService
    .image('consultation-portal')
    .namespace('consultation-portal')
    .codeOwner(CodeOwners.Advania)
    .serviceAccount('consultation-portal')
    .liveness('/liveness')
    .readiness('/liveness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .env({
      BASEPATH: '/consultation-portal',
      ENVIRONMENT: ref((h) => h.env.type),
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
      IDENTITY_SERVER_ISSUER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is',
      },
      NEXTAUTH_URL: {
        local: 'http://localhost:4200/samradsgatt/api/auth',
        dev: 'https://beta.dev01.devland.is/samradsgatt/api/auth',
        staging: 'https://beta.staging01.devland.is/samradsgatt/api/auth',
        prod: 'https://island.is/samradsgatt/api/auth',
      },
      BACKEND_DL_URL: {
        dev: 'https://samradapi-test.devland.is/api/Documents/',
        staging: 'https://samradapi-test.devland.is/api/Documents/',
        prod: 'https://samradapi.island.is/api/Documents/',
      },
    })
    .secrets({
      DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
      IDENTITY_SERVER_SECRET: '/k8s/consultation-portal/IDENTITY_SERVER_SECRET',
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/samradsgatt'],
      },
    })
  return consultationService
}
