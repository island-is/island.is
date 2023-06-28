import { Configuration } from '../../gen/fetch'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { IntellectualPropertyClientConfig } from './intellectualPropertyClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const ApiConfig = {
  provide: 'IntellectualPropertyClientProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof IntellectualPropertyClientConfig>) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        logErrorResponseBody: true,
        name: 'clients-intellectual-property',
      }),
      basePath: `https://webapi.hugverk.is/apiv3`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ApiKey: config.apiKey,
      },
    }),
  inject: [IntellectualPropertyClientConfig.KEY],
}
