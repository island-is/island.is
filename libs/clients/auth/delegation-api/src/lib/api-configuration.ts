import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { AuthDelegationApiClientConfig } from './auth-delegation-api-client.config'

export const ApiConfiguration = {
  provide: 'AuthDelegationApiClientConfiguration',
  useFactory: (config: ConfigType<typeof AuthDelegationApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-auth-delegation-api',
        organizationSlug: 'stafraent-island',
      }),
      basePath: config.basePath,
    })
  },
  inject: [AuthDelegationApiClientConfig.KEY],
}
