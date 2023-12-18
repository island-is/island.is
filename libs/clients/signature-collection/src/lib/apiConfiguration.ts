import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { SignatureCollectionClientConfig } from './signature-collection.config'

export const ApiConfiguration = {
  provide: 'SignatureCollectionClientApiConfiguration',
  scope: LazyDuringDevScope,
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof SignatureCollectionClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-signature-collection',
        organizationSlug: 'thjodskra-islands',
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [SignatureCollectionClientConfig.KEY, XRoadConfig.KEY],
}
