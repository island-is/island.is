import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { UserProfileClientConfig } from './userProfileClient.config'

export const ApiConfiguration = {
  provide: 'UserProfileClientConfiguration',
  useFactory: (config: ConfigType<typeof UserProfileClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-user-profile',
      }),
      basePath: config.basePath,
    })
  },
  inject: [UserProfileClientConfig.KEY],
}
