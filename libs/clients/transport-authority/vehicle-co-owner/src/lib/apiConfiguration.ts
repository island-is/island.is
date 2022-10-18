import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { CoOwnersApi, Configuration } from '../../gen/fetch'
import { VehicleCoOwnerClientConfig } from './vehicleCoOwnerClient.config'

const configFactory = (
  config: ConfigType<typeof VehicleCoOwnerClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-co-owner',
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: CoOwnersApi,
    useFactory: (config: ConfigType<typeof VehicleCoOwnerClientConfig>) => {
      return new CoOwnersApi(
        new Configuration(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPath}`),
        ),
      )
    },
    inject: [VehicleCoOwnerClientConfig.KEY],
  },
]
