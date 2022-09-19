import { Configuration, VehicleSearchApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { VehiclesClientConfig } from './vehiclesClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const VehiclesApiProvider: Provider<VehicleSearchApi> = {
  provide: VehicleSearchApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VehiclesClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new VehicleSearchApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-vehicles',
          timeout: config.fetch.timeout,
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
          'Content-Type': 'application/json',
        },
      }),
    ),

  inject: [XRoadConfig.KEY, VehiclesClientConfig.KEY, IdsClientConfig.KEY],
}
