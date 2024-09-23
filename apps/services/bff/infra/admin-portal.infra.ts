import { ServiceBuilder, json, service } from '../../../../infra/src/dsl/dsl'

const generateWebBaseUrls = (path = '') => {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }

  return {
    dev: `https://beta.dev01.devland.is${path}`,
    staging: `https://beta.staging01.devland.is${path}`,
    prod: `https://island.is${path}`,
  }
}

export const serviceSetup = (): ServiceBuilder<'services-bff-admin-portal'> =>
  service('services-bff-admin-portal')
    .namespace('services-bff')
    .image('services-bff')
    .redis()
    .env({
      // Idenity server
      IDENTITY_SERVER_CLIENT_ID: '@admin.island.is/bff',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_CLIENT_SCOPES: json([
        '@admin.island.is/delegation-system',
        '@admin.island.is/delegation-system:admin',
        '@admin.island.is/ads',
        '@admin.island.is/ads:explicit',
        '@admin.island.is/delegations',
        '@admin.island.is/regulations',
        '@admin.island.is/regulations:manage',
        '@admin.island.is/icelandic-names-registry',
        '@admin.island.is/document-provider',
        '@admin.island.is/application-system:admin',
        '@admin.island.is/application-system:institution',
        '@admin.island.is/auth',
        '@admin.island.is/auth:admin',
        '@admin.island.is/petitions',
        '@admin.island.is/service-desk',
        '@admin.island.is/signature-collection:process',
        '@admin.island.is/signature-collection:manage',
        '@admin.island.is/form-system',
        '@admin.island.is/form-system:admin',
      ]),
      // BFF
      BFF_CLIENT_KEY_PATH: '/stjornbord',
      BFF_CALLBACKS_BASE_PATH: generateWebBaseUrls('/stjornbord/bff/callbacks'),
      BFF_CLIENT_BASE_URL: generateWebBaseUrls(),
      BFF_LOGOUT_REDIRECT_URI: generateWebBaseUrls(),
      BFF_PROXY_API_ENDPOINT: generateWebBaseUrls('/api/graphql'),
      BFF_ALLOWED_EXTERNAL_API_URLS: {
        dev: json(['https://api.dev01.devland.is']),
        staging: json(['https://api.staging01.devland.is']),
        prod: json(['https://api.island.is']),
      },
    })
    .secrets({
      // The secret should be a valid 32-byte base64 key.
      // Generate key example: `openssl rand -base64 32`
      BFF_TOKEN_SECRET_BASE64: '/k8s/services-bff/BFF_TOKEN_SECRET_BASE64',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-bff/IDENTITY_SERVER_CLIENT_SECRET',
    })
    .readiness('/health/check')
    .liveness('/liveness')
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
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
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/stjornbord/bff'],
      },
    })
