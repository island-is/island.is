import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'

import { HmsApplicationSystemConfig } from './hms-application-system.config'

export const ApiConfiguration = {
  provide: 'HmsApplicationSystemApiConfiguration',
  useFactory: (
    config: ConfigType<typeof HmsApplicationSystemConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-hms-application-system',
        organizationSlug: 'hms',
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.servicePath}`,
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [HmsApplicationSystemConfig.KEY, XRoadConfig.KEY],
}
