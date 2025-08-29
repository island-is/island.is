import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'

import { Configuration, StatisticsApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { DocumentProviderDashboardClientConfig } from './documentProviderDashboardClient.config'

export const DocumentProviderDashboardProvider: Provider<StatisticsApi> = {
  provide: StatisticsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof DocumentProviderDashboardClientConfig>,
  ) =>
    new StatisticsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-document-provider-dashboard',
          autoAuth: {
            mode: 'token',
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            scope: [config.scope],
            issuer: '',
            tokenEndpoint: config.tokenUrl,
          },
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [DocumentProviderDashboardClientConfig.KEY],
}
