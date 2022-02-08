import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { ApplicationsApi, Configuration } from '../../gen/fetch'

import { ApplicationClientConfig } from './application-client.config'

export const ApplicationApiProvider = {
  provide: ApplicationsApi,
  useFactory: (config: ConfigType<typeof ApplicationClientConfig>) => {
    return new ApplicationsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-application',
        }),
        basePath: config.basePath,
      }),
    )
  },
  inject: [ApplicationClientConfig.KEY],
}
