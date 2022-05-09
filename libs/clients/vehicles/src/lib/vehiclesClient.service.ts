import { Configuration, VehiclesApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { VehiclesClientConfig } from './vehiclesClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const VehiclesApiProvider: Provider<VehiclesApi> = {
  provide: VehiclesApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VehiclesClientConfig>,
  ) =>
    new VehiclesApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-vehicles',
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, VehiclesClientConfig.KEY],
}
