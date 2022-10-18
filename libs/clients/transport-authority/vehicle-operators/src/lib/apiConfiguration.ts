import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { OperatorApi, Configuration } from '../../gen/fetch'
import { VehicleOperatorsClientConfig } from './vehicleOperatorsClient.config'

const configFactory = (
  config: ConfigType<typeof VehicleOperatorsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-operators',
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
    provide: OperatorApi,
    useFactory: (config: ConfigType<typeof VehicleOperatorsClientConfig>) => {
      return new OperatorApi(
        new Configuration(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPath}`),
        ),
      )
    },
    inject: [VehicleOperatorsClientConfig.KEY],
  },
]
