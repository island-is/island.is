import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { NationalRegistryRealEstateClientConfig } from './nationalRegistryRealEstateClient.config'
import { getCache } from './cache'

export const ApiConfiguration = {
  provide: 'NationalRegistryRealEstateClientApiConfiguration',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryRealEstateClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-real-estate-v1',
        cache: getCache(config),
        ...config.fetch,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [XRoadConfig.KEY, NationalRegistryRealEstateClientConfig.KEY],
}
