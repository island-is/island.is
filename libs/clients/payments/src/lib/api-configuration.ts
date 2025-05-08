import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { PaymentsApiClientConfig } from './payments-client.config'

export const ApiConfiguration = {
  provide: 'PaymentsApiClientConfiguration',
  useFactory: (config: ConfigType<typeof PaymentsApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-payments-api',
        organizationSlug: 'stafraent-island',
      }),
      basePath: config.basePath,
    })
  },
  inject: [PaymentsApiClientConfig.KEY],
}
