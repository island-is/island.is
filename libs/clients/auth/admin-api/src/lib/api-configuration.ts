import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { AuthAdminApiClientConfig } from './auth-admin-api-client.config'

export const ApiConfiguration = {
  provide: 'AuthDelegationApiClientConfiguration',
  useFactory: (config: ConfigType<typeof AuthAdminApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-auth-delegation-api',
      }),
      basePath: config.basePath,
    })
  },
  inject: [AuthAdminApiClientConfig.KEY],
}
