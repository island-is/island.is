import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { VehiclesClientConfig } from './vehiclesClient.config'

export const ApiConfiguration = {
  provide: 'DrivingLicenseBookClientApiConfiguration',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VehiclesClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-vehicles',
        ...config.fetch,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [XRoadConfig.KEY, VehiclesClientConfig.KEY],
}
