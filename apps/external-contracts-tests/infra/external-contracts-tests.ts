import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import { Base, NationalRegistry } from '../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'external-contracts-tests'> => {
  return service('external-contracts-tests')
    .namespace('external-contracts-tests')
    .extraAttributes({
      dev: { schedule: '0 11 * * *' },
      staging: { schedule: '0 11 * * *' },
      prod: { schedule: '0 11 * * *' },
    })
    .env({})
    .secrets({})
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
