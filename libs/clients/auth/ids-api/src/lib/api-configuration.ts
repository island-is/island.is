import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { AuthIdsApiClientConfig } from './auth-ids-api-client.config'

export const ApiConfiguration = {
  provide: 'AuthIdsApiClientConfiguration',
  useFactory: (config: ConfigType<typeof AuthIdsApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-auth-ids-api',
        organizationSlug: 'stafraent-island',
      }),
      basePath: config.basePath,
    })
  },
  inject: [AuthIdsApiClientConfig.KEY],
}
