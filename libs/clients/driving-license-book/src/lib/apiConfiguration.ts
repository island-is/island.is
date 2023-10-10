import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { DrivingLicenseBookClientConfig } from './drivingLicenseBookClient.config'

export const ApiConfiguration = {
  provide: 'DrivingLicenseBookClientApiConfiguration',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof DrivingLicenseBookClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-driving-license-book',
        organizationSlug: 'samgongustofa',
        ...config.fetch,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [XRoadConfig.KEY, DrivingLicenseBookClientConfig.KEY],
}
