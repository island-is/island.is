import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-api'> =>
  service('judicial-system-api')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-api')
    .env({
      SAML_ENTRY_POINT: {
        dev: 'https://innskraning.island.is/?id=judicial-system.dev',
        staging: 'https://innskraning.island.is/?id=judicial-system.staging',
        prod: 'https://innskraning.island.is/?id=rettarvorslugatt.prod',
      },
      AUTH_AUDIENCE: {
        dev: ref((h) => `judicial-system.${h.env.domain}`),
        staging: ref((h) => `judicial-system.${h.env.domain}`),
        prod: 'rettarvorslugatt.island.is',
      },
      AUTH_IDS_ID: {
        dev: 'judicial-system.dev',
        staging: 'judicial-system.staging',
        prod: 'rettarvorslugatt.prod',
      },
      AUTH_IDS_NAME: 'Iceland authentication service',
      AUTH_IDS_SCOPE: 'openid profile',
      AUTH_IDS_CLIENT_ID: '@rettarvorslugatt.island.is/web',
      AUTH_IDS_DOMAIN: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      AUTH_IDS_REDIRECT_URI: {
        dev:
          'https://judicial-system.dev01.devland.is/api/auth/callback/identity-server',
        staging:
          'https://judicial-system.staging01.devland.is/api/auth/callback/identity-server',
        prod:
          'https://rettarvorslugatt.island.is/api/auth/callback/identity-server',
      },
      AUTH_JWKS_ENDPOINT: '.well-known/openid-configuration/jwks',
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
        staging: 'APPEAL_TO_COURT_OF_APPEALS',
        prod: 'APPEAL_TO_COURT_OF_APPEALS',
      },
    })
    .secrets({
      AUTH_JWT_SECRET: '/k8s/judicial-system/AUTH_JWT_SECRET',
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/judicial-system/CONTENTFUL_ACCESS_TOKEN',
      AUTH_IDS_SECRET: '/k8s/judicial-system/AUTH_IDS_SECRET',
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
        paths: ['/api/graphql', '/api/auth', '/api/case', '/api/feature'],
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
    .grantNamespaces('nginx-ingress-external')
