import { ref, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { settings } from '../../../../../infra/src/dsl/settings'

export const serviceSetup = (services: {
  servicesTemporaryVoterRegistryApi: ServiceBuilder<'services-temporary-voter-registry-api'>
}): ServiceBuilder<'endorsement-system-scripts-update-metadata'> =>
  service('endorsement-system-scripts-update-metadata')
    .namespace('endorsement-system')
    .image('services-endorsements-scripts-update-metadata')
    .env({
      TEMPORARY_VOTER_REGISTRY_API_URL: ref(
        (h) => `http://${h.svc(services.servicesTemporaryVoterRegistryApi)}`,
      ),
    })
    .secrets({
      SOFFIA_HOST_URL: '/k8s/endorsement-system-api/SOFFIA_HOST_URL',
      SOFFIA_SOAP_URL: '/k8s/endorsement-system-api/SOFFIA_SOAP_URL',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
    })
    .command('node')
    .args('update-metadata.js')
    .extraAttributes({
      dev: { schedule: '1 0/1 * * *' },
      staging: { schedule: '1 0/1 * * *' },
      prod: { schedule: '1 0/1 * * *' },
    })
