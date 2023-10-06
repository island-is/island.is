import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, StaediskortaMalApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { PCardClientConfig } from './pCardClient.config'

export const PCardApiProvider: Provider<StaediskortaMalApi> = {
  provide: StaediskortaMalApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof PCardClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StaediskortaMalApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-p-card',
          organizationSlug: 'syslumenn',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: [],
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, PCardClientConfig.KEY, IdsClientConfig.KEY],
}
