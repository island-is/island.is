import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { PlateOrderingApi, Configuration } from '../../gen/fetch'
import { VehiclePlateOrderingClientConfig } from './vehiclePlateOrderingClient.config'

const configFactory = (
  config: ConfigType<typeof VehiclePlateOrderingClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-printing',
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
  headers: {
    'X-Road-Client': config.xroadClientId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: PlateOrderingApi,
    useFactory: (
      config: ConfigType<typeof VehiclePlateOrderingClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new PlateOrderingApi(
        new Configuration(
          configFactory(
            config,
            idsClientConfig,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [VehiclePlateOrderingClientConfig.KEY, IdsClientConfig.KEY],
  },
]
