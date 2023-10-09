import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { CodeTableApi, Configuration } from '../../gen/fetch'
import { VehicleCodetablesClientConfig } from './vehicleCodetablesClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-codetables',
    organizationSlug: 'samgongustofa',
  }),
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: CodeTableApi,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof VehicleCodetablesClientConfig>,
    ) => {
      return new CodeTableApi(
        new Configuration(
          configFactory(
            xRoadConfig,
            `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [XRoadConfig.KEY, VehicleCodetablesClientConfig.KEY],
  },
]
