import { Configuration, MileageReadingApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { VehiclesMileageClientConfig } from './vehiclesMileageClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const VehiclesMileageApiProvider: Provider<MileageReadingApi> = {
  provide: MileageReadingApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VehiclesMileageClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new MileageReadingApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-vehicles-mileage',
          organizationSlug: 'samgongustofa',
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

  inject: [
    XRoadConfig.KEY,
    VehiclesMileageClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
