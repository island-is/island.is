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
      XROAD_BASE_PATH_WITH_ENV: {
        dev: 'https://securityserver.dev01.devland.is/r1/IS-DEV',
        staging: 'https://securityserver.staging01.devland.is/r1/IS-TEST',
        prod: 'https://securityserver.island.is/r1/IS',
      },
      XROAD_CLIENT_ID: {
        dev: 'IS-DEV/GOV/10014/Rettarvorslugatt-Client',
        staging: 'IS-TEST/GOV/5804170510/Rettarvorslugatt-Client',
        prod: 'IS/GOV/5804170510/Rettarvorslugatt-Client',
      },
      XROAD_COURT_MEMBER_CODE: {
        dev: '10019',
        staging: '4707171140',
        prod: '4707171140',
      },
      HIDDEN_FEATURES: {
        dev: '',
        staging: 'POLICE_CASE_FILES',
        prod: 'POLICE_CASE_FILES',
      },
    })
    .secrets({
      XROAD_COURT_API_PATH: '/k8s/judicial-system/XROAD_COURT_API_PATH',
      AUTH_JWT_SECRET: '/k8s/judicial-system/AUTH_JWT_SECRET',
      COURTS_CREDENTIALS: '/k8s/judicial-system/COURTS_CREDENTIALS',
      XROAD_CLIENT_CERT: '/k8s/judicial-system/XROAD_CLIENT_CERT',
      XROAD_CLIENT_KEY: '/k8s/judicial-system/XROAD_CLIENT_KEY',
      XROAD_CLIENT_PEM: '/k8s/judicial-system/XROAD_CLIENT_PEM',
      SECRET_TOKEN: '/k8s/judicial-system/SECRET_TOKEN',
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
        paths: ['/api'],
      },
    })
    .grantNamespaces('nginx-ingress-external')
