import { Base, JudicialSystem } from '../../../../infra/src/dsl/xroad'
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
        staging: 'INDICTMENTS, INDICTMENT_ROUTE',
        prod: 'INDICTMENTS, INDICTMENT_ROUTE',
      },
    })
    .xroad(Base, JudicialSystem)
    .secrets({
      AUTH_JWT_SECRET: '/k8s/judicial-system/AUTH_JWT_SECRET',
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/judicial-system/CONTENTFUL_ACCESS_TOKEN',
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
