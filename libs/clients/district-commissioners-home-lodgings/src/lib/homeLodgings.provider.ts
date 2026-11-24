import { Provider } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, IslandISHeimagistingarApi } from '../../gen/fetch'
import { DistrictCommissionersHomeLodgingsClientConfig } from './homeLodgings.config'

export const HomeLodgingsApiProvider: Provider<IslandISHeimagistingarApi> = {
  provide: IslandISHeimagistingarApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof DistrictCommissionersHomeLodgingsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new IslandISHeimagistingarApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-district-commissioners-home-lodgings',
          organizationSlug: 'syslumenn',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.scope,
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
  inject: [
    XRoadConfig.KEY,
    DistrictCommissionersHomeLodgingsClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
