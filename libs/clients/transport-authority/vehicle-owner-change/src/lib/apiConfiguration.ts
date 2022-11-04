import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { OwnerChangeApi, Configuration } from '../../gen/fetch'
import { VehicleOwnerChangeClientConfig } from './vehicleOwnerChangeClient.config'

const configFactory = (
  config: ConfigType<typeof VehicleOwnerChangeClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-owner-change',
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
    provide: OwnerChangeApi,
    useFactory: (config: ConfigType<typeof VehicleOwnerChangeClientConfig>) => {
      return new OwnerChangeApi(
        new Configuration(
          configFactory(
            config,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [VehicleOwnerChangeClientConfig.KEY],
  },
]
