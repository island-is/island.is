import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { NationalRegistryClientConfig } from './nationalRegistryClient.config'
import { getCache } from './cache'

export const ApiConfiguration = {
  provide: 'NationalRegistryClientApiConfiguration',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v2',
        //cache: getCache(config),
        ...config.fetch,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [XRoadConfig.KEY, NationalRegistryClientConfig.KEY],
}
