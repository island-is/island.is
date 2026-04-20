import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { DocumentProviderDashboardClientConfig } from './documentProviderDashboardClient.config'

export const ApiConfiguration = {
  provide: 'DocumentProviderDashboardApiClientConfiguration',
  useFactory: (
    config: ConfigType<typeof DocumentProviderDashboardClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-document-provider-dashboard-api',
        organizationSlug: 'stafraent-island',
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
    })
  },
  inject: [DocumentProviderDashboardClientConfig.KEY],
}
