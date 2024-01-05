import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { AuthPublicApiClientConfig } from './authPublicApiClient.config'

export const ApiConfiguration = {
  provide: 'AuthPublicApiClientConfiguration',
  useFactory: (config: ConfigType<typeof AuthPublicApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-auth-public-api',
        organizationSlug: 'stafraent-island',
      }),
      basePath: config.basePath,
    })
  },
  inject: [AuthPublicApiClientConfig.KEY],
}
