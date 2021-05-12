import { ref, service, ServiceBuilder } from '../../../../libs/helm/dsl/dsl'
import { MissingSetting } from '../../../../libs/helm/dsl/types/input-types'

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
      AUDIT_GROUP_NAME: 'k8s/island-is/audit-log',
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
      SAMGONGUSTOFA_SOAP_USER: {
        dev: 'DeloitteTest',
        staging: 'DeloitteTest',
        prod: 'StafraentIsland',
      },
      SAMGONGUSTOFA_SOAP_URL: {
        dev:
          'https://test-xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS',
        staging:
          'https://test-xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS',
        prod:
          'https://xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS',
      },
      SAMGONGUSTOFA_REST_USER: {
        dev: 'DELOITTE.AFSKRA',
        staging: 'DELOITTE.AFSKRA',
        prod: 'ISLANDIS.AFSKRA',
      },
      SAMGONGUSTOFA_REST_AUTH_URL: {
        dev:
          'https://test-api.samgongustofa.is/vehicle/registrations/authenticate',
        staging:
          'https://test-api.samgongustofa.is/vehicle/registrations/authenticate',
        prod: 'https://api.samgongustofa.is/vehicle/registrations/authenticate',
      },
      SAMGONGUSTOFA_REST_DEREG_URL: {
        dev:
          'https://test-api.samgongustofa.is/vehicle/registrations/deregistration',
        staging:
          'https://test-api.samgongustofa.is/vehicle/registrations/deregistration',
        prod:
          'https://api.samgongustofa.is/vehicle/registrations/deregistration',
      },
      FJARSYSLA_REST_USER: {
        dev: 'fjs-samgong-p',
        staging: 'fjs-samgong-p',
        prod: 'fjs-samgong-r',
      },
      FJARSYSLA_REST_URL: {
        dev: 'https://tbrws-s.hysing.is/restv2/LeggjaASkilagjald',
        staging: 'https://tbrws-s.hysing.is/restv2/LeggjaASkilagjald',
        prod: 'https://tbrws.hysing.is/restv2/LeggjaASkilagjald',
      },
    })
    .secrets({
      AUTH_JWT_SECRET: '/k8s/skilavottord/AUTH_JWT_SECRET',
      SAMGONGUSTOFA_REST_PASS: '/k8s/skilavottord/SAMGONGUSTOFA_REST_PASS',
      SAMGONGUSTOFA_SOAP_PASS: '/k8s/skilavottord/SAMGONGUSTOFA_SOAP_PASS',
      FJARSYSLA_REST_PASS: '/k8s/skilavottord/FJARSYSLA_REST_PASS',
      SKILAVOTTORD_USER_LIST: '/k8s/skilavottord/SKILAVOTTORD_USER_LIST',
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
