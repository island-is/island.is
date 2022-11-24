import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  XRoadConfig,
  IdsClientConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { VehicleServiceFjsV1ClientConfig } from './vehicleServiceFjsV1Client.config'

export const ApiConfiguration = {
  provide: 'VehicleServiceFjsV1ClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof VehicleServiceFjsV1ClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-vehicle-service-fjs-v1',
        timeout: config.fetchTimeout,
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
    })
  },
  inject: [
    VehicleServiceFjsV1ClientConfig.KEY,
    XRoadConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
