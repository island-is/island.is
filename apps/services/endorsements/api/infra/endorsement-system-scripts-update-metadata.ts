import { PostgresInfo } from '../../../../../infra/src/dsl/types/input-types'
import { ref, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { settings } from '../../../../../infra/src/dsl/settings'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/services-endorsements-api/DB_PASSWORD',
  name: 'services_endorsements_api',
  username: 'services_endorsements_api',
}
export const serviceSetup = (services: {
  servicesTemporaryVoterRegistryApi: ServiceBuilder<'services-temporary-voter-registry-api'>
}): ServiceBuilder<'endorsement-system-scripts-update-metadata'> =>
  service('endorsement-system-scripts-update-metadata')
    .namespace('endorsement-system')
    .image('services-endorsements-api')
    .env({
      TEMPORARY_VOTER_REGISTRY_API_URL: ref(
        (h) => `http://${h.svc(services.servicesTemporaryVoterRegistryApi)}`,
      ),
    })
    .postgres(postgresInfo)
    .secrets({
      SOFFIA_HOST_URL: '/k8s/endorsement-system-api/SOFFIA_HOST_URL',
      SOFFIA_SOAP_URL: '/k8s/endorsement-system-api/SOFFIA_SOAP_URL',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
    })
    .command('node')
    .args('--tls-min-v1.0', 'updateMetadata.js')
    .extraAttributes({
      dev: { schedule: '1 */6 * * *' },
      staging: { schedule: '1 */6 * * *' },
      prod: { schedule: '1 */6 * * *' },
    })
