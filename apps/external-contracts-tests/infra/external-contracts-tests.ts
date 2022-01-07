import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import { Base, Client, NationalRegistry } from '../../../infra/src/dsl/xroad'
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
    .xroad(Base, Client, NationalRegistry)
}
