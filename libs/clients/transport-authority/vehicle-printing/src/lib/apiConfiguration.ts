import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { RegistrationApi, Configuration } from '../../gen/fetch'
import { VehiclePrintingClientConfig } from './vehiclePrintingClient.config'

const configFactory = (
  config: ConfigType<typeof VehiclePrintingClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-printing',
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
    provide: RegistrationApi,
    useFactory: (config: ConfigType<typeof VehiclePrintingClientConfig>) => {
      return new RegistrationApi(
        new Configuration(
          configFactory(
            config,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [VehiclePrintingClientConfig.KEY],
  },
]
