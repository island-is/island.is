import { Configuration } from '../../gen/fetch'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { IntellectualPropertiesClientConfig } from './intellectualPropertiesClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const ApiConfig = {
  provide: 'IntellectualPropertiesClientProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof IntellectualPropertiesClientConfig>) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        organizationSlug: 'hugverkastofan',
        name: 'clients-intellectual-properties',
      }),
      basePath: `https://webapi.hugverk.is/apiv3`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ApiKey: config.apiKey,
      },
    }),
  inject: [IntellectualPropertiesClientConfig.KEY],
}
