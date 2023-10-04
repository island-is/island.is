import { Configuration } from '../../gen/fetch'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { InnaClientConfig } from './innaClient.config'

export const ApiConfig = {
  provide: 'InnaApiProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof InnaClientConfig>) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-inna',

        timeout: config.fetch.timeout,
      }),
      basePath: `https://api-test.inna.is/namsferlaveita/`,
    }),
  inject: [InnaClientConfig.KEY],
}
