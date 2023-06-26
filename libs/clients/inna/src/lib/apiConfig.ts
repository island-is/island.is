import { Configuration } from '../../gen/fetch'
import {
  ConfigType,
  LazyDuringDevScope,
  // XRoadConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { InnaClientConfig } from './innaClient.config'

export const ApiConfig = {
  provide: 'InnaApiProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof InnaClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-inna',
        timeout: config.fetch.timeout,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
              tokenExchange: {
                requestActorToken: config.requestActorToken,
              },
            }
          : undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    }),
  inject: [InnaClientConfig.KEY, XRoadConfig.KEY],
}
