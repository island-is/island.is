import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'

import { ArborgWorkpoinClientConfig } from './arborgWorkpoint.config'

export const ApiConfiguration = {
  provide: 'WorkPointArborgClientApiConfiguration',
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof ArborgWorkpoinClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    console.log('xroad', xroadConfig)
    console.log('norms ', config)
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-workpoint-arborg',
        organizationSlug: 'samband-islenskra-sveitafelaga',
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.servicePath}`,
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [ArborgWorkpoinClientConfig.KEY, XRoadConfig.KEY],
}
