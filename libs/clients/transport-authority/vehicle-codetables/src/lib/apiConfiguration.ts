import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { CodeTableApi, Configuration } from '../../gen/fetch'
import { VehicleCodetablesClientConfig } from './vehicleCodetablesClient.config'

const configFactory = (
  config: ConfigType<typeof VehicleCodetablesClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-codetables',
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
    provide: CodeTableApi,
    useFactory: (config: ConfigType<typeof VehicleCodetablesClientConfig>) => {
      return new CodeTableApi(
        new Configuration(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPath}`),
        ),
      )
    },
    inject: [VehicleCodetablesClientConfig.KEY],
  },
]
