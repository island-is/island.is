import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { IslandIsEndpointsApi, Configuration } from '../../gen/fetch'
import { TaxiClientConfig } from './taxiClient.config'

export const exportedApis = [
  {
    provide: IslandIsEndpointsApi,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof TaxiClientConfig>,
    ) => {
      return new IslandIsEndpointsApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-transport-authority-taxi',
            organizationSlug: 'samgongustofa',
          }),
          headers: {
            'X-Road-Client': xRoadConfig.xRoadClient,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
        }),
      )
    },
    inject: [XRoadConfig.KEY, TaxiClientConfig.KEY],
  },
]
