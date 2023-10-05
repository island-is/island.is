import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { SessionsApiClientConfig } from './sessions-client.config'

export const ApiConfiguration = {
  provide: 'SessionsApiClientConfiguration',
  useFactory: (config: ConfigType<typeof SessionsApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-sessions-api',
        organizationSlug: 'stafraent-island',
      }),
      basePath: config.basePath,
    })
  },
  inject: [SessionsApiClientConfig.KEY],
}
