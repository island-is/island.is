import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  username: 'skilavottord',
  name: 'skilavottord',
  passwordSecret: '/k8s/skilavottord/DB_PASSWORD',
}
export const serviceSetup = (): ServiceBuilder<'skilavottord-ws'> =>
  service('skilavottord-ws')
    .namespace('skilavottord')
    .postgres(postgresInfo)
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .env({
      SAML_ENTRY_POINT: {
        dev: 'https://innskraning.island.is/?id=sv_citizen.dev',
        staging: 'https://innskraning.island.is/?id=sv_citizen.staging&qaa=4',
        prod: 'https://innskraning.island.is/?id=sv_citizen.prod&qaa=4',
      },
      SAML_ENTRY_POINT2: {
        dev: 'https://innskraning.island.is/?id=sv_company.dev',
        staging: 'https://innskraning.island.is/?id=sv_company.staging&qaa=4',
        prod: 'https://innskraning.island.is/?id=sv_company.prod&qaa=4',
      },
      AUTH_AUDIENCE: {
        dev: 'beta.dev01.devland.is',
        staging: 'beta.staging01.devland.is',
        prod: 'island.is',
      },
    })
    .secrets({
      SAMGONGUSTOFA_SOAP_URL: '/k8s/skilavottord-ws/SAMGONGUSTOFA_SOAP_URL',
      SAMGONGUSTOFA_REST_AUTH_URL:
        '/k8s/skilavottord-ws/SAMGONGUSTOFA_REST_AUTH_URL',
      SAMGONGUSTOFA_REST_DEREG_URL:
        '/k8s/skilavottord-ws/SAMGONGUSTOFA_REST_DEREG_URL',
      FJARSYSLA_REST_URL: '/k8s/skilavottord-ws/FJARSYSLA_REST_URL',
      AUTH_JWT_SECRET: '/k8s/skilavottord/AUTH_JWT_SECRET',
      SAMGONGUSTOFA_REST_PASS: '/k8s/skilavottord/SAMGONGUSTOFA_REST_PASS',
      SAMGONGUSTOFA_SOAP_PASS: '/k8s/skilavottord/SAMGONGUSTOFA_SOAP_PASS',
      FJARSYSLA_REST_PASS: '/k8s/skilavottord/FJARSYSLA_REST_PASS',
      SKILAVOTTORD_USER_LIST: '/k8s/skilavottord/SKILAVOTTORD_USER_LIST',
      SAMGONGUSTOFA_SOAP_USER: '/k8s/skilavottord/SAMGONGUSTOFA_SOAP_USER',
      SAMGONGUSTOFA_REST_USER: '/k8s/skilavottord/SAMGONGUSTOFA_REST_USER',
      FJARSYSLA_REST_USER: '/k8s/skilavottord/FJARSYSLA_REST_USER',
      IDENTITY_SERVER_ISSUER_URL:
        '/k8s/skilavottord/ws/IDENTITY_SERVER_ISSUER_URL',
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
        paths: ['/app/skilavottord/api/'],
      },
    })
