import {
  json,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-api'> =>
  service('judicial-system-api')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-api')
    .env({
      AUTH_IDS_SCOPE: 'openid profile offline_access',
      AUTH_IDS_CLIENT_ID: '@rettarvorslugatt.island.is/web',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      AUTH_IDS_REDIRECT_URI: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }judicial-system.dev01.devland.is/api/auth/callback/identity-server`,
        ),
        staging:
          'https://judicial-system.staging01.devland.is/api/auth/callback/identity-server',
        prod: 'https://rettarvorslugatt.island.is/api/auth/callback/identity-server',
      },
      AUTH_IDS_LOGOUT_REDIRECT_URI: {
        dev: 'https://judicial-system.dev01.devland.is',
        staging: 'https://judicial-system.staging01.devland.is',
        prod: 'https://rettarvorslugatt.island.is',
      },
      ALLOW_AUTH_BYPASS: { dev: 'true', staging: 'true', prod: 'false' },
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      AUDIT_TRAIL_USE_GENERIC_LOGGER: 'false',
      AUDIT_TRAIL_GROUP_NAME: 'k8s/judicial-system/audit-log',
      AUDIT_TRAIL_REGION: 'eu-west-1',
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      CONTENTFUL_ENVIRONMENT: {
        dev: 'test',
        staging: 'test',
        prod: 'master',
      },
      HIDDEN_FEATURES: {
        dev: '',
        staging: '',
        prod: '',
      },
      REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
    })
    .secrets({
      AUTH_JWT_SECRET: '/k8s/judicial-system/AUTH_JWT_SECRET',
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/judicial-system/CONTENTFUL_ACCESS_TOKEN',
      AUTH_IDS_SECRET: '/k8s/judicial-system/AUTH_IDS_SECRET',
      LAWYERS_ICELAND_API_KEY: '/k8s/judicial-system/LAWYERS_ICELAND_API_KEY',
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .ingress({
      primary: {
        host: {
          dev: 'judicial-system',
          staging: 'judicial-system',
          prod: 'rettarvorslugatt.island.is',
        },
        paths: [
          '/api/graphql',
          '/api/auth',
          '/api/case',
          '/api/feature',
          '/api/defender',
        ],
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
      },
    })
    .replicaCount({
      default: 2,
      max: 10,
      min: 2,
      scalingMagicNumber: 8,
    })
    .resources({
      limits: {
        cpu: '350m',
        memory: '512Mi',
      },
      requests: {
        cpu: '200m',
        memory: '256Mi',
      },
    })
    .grantNamespaces('nginx-ingress-external')
