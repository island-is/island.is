import { ref, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { settings } from '../../../../../infra/src/dsl/settings'
import { PostgresInfo } from '../../../../../infra/src/dsl/types/input-types'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/services-endorsements-api/DB_PASSWORD',
  name: 'services_endorsements_api',
  username: 'services_endorsements_api',
}
export const serviceSetup = (services: {
  servicesTemporaryVoterRegistryApi: ServiceBuilder<'services-temporary-voter-registry-api'>
}): ServiceBuilder<'endorsement-system-api'> =>
  service('endorsement-system-api')
    .image('services-endorsements-api')
    .namespace('endorsement-system')
    .serviceAccount('endorsement-system-api')
    .command('node')
    .args('--tls-min-v1.0', 'main.js')
    .postgres(postgresInfo)
    .initContainer({
      containers: [
        {
          name: 'migrations',
          command: 'npx',
          args: ['sequelize-cli', 'db:migrate'],
        },
      ],
      postgres: postgresInfo,
    })
    .env({
      EMAIL_REGION: 'eu-west-1',
      TEMPORARY_VOTER_REGISTRY_API_URL: ref(
        (h) => `http://${h.svc(services.servicesTemporaryVoterRegistryApi)}`,
      ),
    })
    .secrets({
      ACCESS_GROUP_DMR:
        '/k8s/application-system/api/PARTY_LETTER_ASSIGNED_ADMINS',
      SOFFIA_HOST_URL: '/k8s/endorsement-system-api/SOFFIA_HOST_URL',
      SOFFIA_SOAP_URL: '/k8s/endorsement-system-api/SOFFIA_SOAP_URL',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
    })
    .grantNamespaces('islandis', 'application-system')
    .liveness('/liveness')
    .readiness('/liveness')
