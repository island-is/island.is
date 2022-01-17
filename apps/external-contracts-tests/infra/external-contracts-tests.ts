import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import { Base, NationalRegistry } from '../../../infra/src/dsl/xroad'
import { settings } from '../../../infra/src/dsl/settings'

export const serviceSetup = (): ServiceBuilder<'external-contracts-tests'> => {
  return service('external-contracts-tests')
    .namespace('external-contracts-tests')
    .extraAttributes({
      dev: { schedule: '0 11 * * *' },
      staging: { schedule: '0 11 * * *' },
      prod: { schedule: '0 11 * * *' },
    })
    .env({})
    .secrets({
      SOFFIA_SOAP_URL: '/k8s/api/SOFFIA_SOAP_URL',
      SOFFIA_HOST_URL: '/k8s/api/SOFFIA_HOST_URL',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
    })
    .resources({
      limits: {
        cpu: '1',
        memory: '1024Mi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    })
    .xroad(Base, NationalRegistry)
}
